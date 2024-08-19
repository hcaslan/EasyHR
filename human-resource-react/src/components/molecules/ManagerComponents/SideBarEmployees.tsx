import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Avatar, Box,
    Button,
    Grid, Modal,

    TextField, Typography

} from "@mui/material";
import { HumanResources, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import * as Icons from '../../atoms/icons';
import {
    changePageState,
    clearToken, fetchActivateUserByManager,
    fetchDeleteEmployeeByAdmin,
    fetchGetAllUsersOfManager, setSelectedEmployeeId
} from "../../../store/feature/authSlice";
import Swal from "sweetalert2";
import { IUser } from "../../../models/IUser";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { fetchSaveBonus } from "../../../store/feature/bonusSlice";
import { setEmployeeIdAndCompanyId } from "../../../store/feature/shiftSlice";
import { fetchGetDefinitions } from "../../../store/feature/definitionSlice";
import { EDefinitionType } from "../../../models/IDefinitionType";
import AddDocument from "./AddDocument";
import AddBonusDialog from "./AddBonus";
import AddBonus from "./AddBonus";
import {AssignItemIcon} from "../../atoms/icons";

export default function SideBarEmployees() {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch<HumanResources>();
    const token = useAppSelector((state) => state.auth.token);
    const userList = useAppSelector((state) => state.auth.userList);
    const employeeTypes = useAppSelector((state) => state.definition.definitionList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [open, setOpen] = useState(false);
    const [openAddDocument, setOpenAddDocument] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [description, setDescription] = useState('');
    const [bonusAmount, setBonusAmount] = useState(0);
    const [bonusDate, setBonusDate] = useState<Date | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpenAddDocument = () => setOpenAddDocument(true);
    const handleCloseAddDocument = () => setOpenAddDocument(false);

    const columns: GridColDef[] = [
        { field: "name", headerName: "First name", flex: 2, headerAlign: "center" },
        { field: "surname", headerName: "Last name", flex: 2, headerAlign: "center" },
        { field: "email", headerName: "Email", headerAlign: "center", flex: 2 },
        { field: "phone", headerName: "Phone", sortable: false, headerAlign: "center", flex: 1 },
        { field: "position", headerName: "Position", type: "string", flex: 2, headerAlign: "center" },
        { field: "userType", headerName: "User Type", flex: 1, headerAlign: "center" },
        { field: "employeeType", headerName: "Employee Type", flex: 1, headerAlign: "center" },
        { field: "status", headerName: "Status", flex: 1, headerAlign: "center" },
        {
            field: "photo",
            headerName: "Photo",
            flex: 1,
            headerAlign: "center",
            sortable: false,
            renderCell: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <Avatar alt={params.row.name} src={params.value} />
                </div>
            ),
        },
    ];

    const handleAssignItem = () => {
        dispatch(setSelectedEmployeeId(selectedRowIds[0]))
        dispatch(changePageState("Assign Item"));
    };

    const handleSetShifts = () => {
        for (let id of selectedRowIds) {
            const selectedEmployee = userList.find((selectedEmployee) => selectedEmployee.id === id);
            if (!selectedEmployee) continue;
            dispatch(setEmployeeIdAndCompanyId({ employeeId: selectedEmployee.id, companyId: selectedEmployee.companyId }));
            dispatch(changePageState("Shift"));

        }
    }
    const openAddBonus = () => {
        if (selectedRowIds.length === 1) {
            const userToEdit = userList.find(
                (user) => user.id === selectedRowIds[0]
            );
            setSelectedUser(userToEdit || null);
            handleOpen();
        } else {
            Swal.fire("Please select exactly one company to edit.");
        }
    };

    const handleAddBonus = () => {
        if (bonusDate === null || bonusAmount === 0 || description === '') {
            handleClose();
            Swal.fire({
                title: "Error",
                text: "Please fill all the fields",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: '#1976D2',
            });
            setIsActivating(false);
            return;

        }
        dispatch(fetchSaveBonus({ token: token, description: description, bonusDate: bonusDate, bonusAmount: bonusAmount, employeeId: selectedRowIds[0] })).then(data => {
            if (data.payload.message) {
                Swal.fire({
                    title: "Error",
                    text: data.payload.message,
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: '#1976D2',

                });
                return
            }
            handleClose();
            Swal.fire({
                title: "Success",
                text: "Bonus added successfully",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: '#1976D2',
            });

        })
    }

    useEffect(() => {
        dispatch(fetchGetDefinitions({
            token: token,
            definitionType: EDefinitionType.EMPLOYEE_TYPE
        })
        ).then(() => {
            dispatch(fetchGetAllUsersOfManager({
                token: token,
                page: 0,
                pageSize: 100,
                searchText: searchText,
            }))
        })
            .catch(() => {
                dispatch(clearToken());
            });
    }, [dispatch, searchText, token, loading, isActivating]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleOnClickAddDocument = () => {
        dispatch(setSelectedEmployeeId(selectedRowIds[0]))
        //dispatch(changePageState("Add Document"))
        handleOpenAddDocument();
    }

    const handleOnClickEditEmployee = () => {
        dispatch(setSelectedEmployeeId(selectedRowIds[0]))
        dispatch(changePageState("Edit Employee"))
    }

    const handleDeleteEmployee = async () => {
        setIsDeleting(true);

        for (let id of selectedRowIds) {
            const selectedEmployee = userList.find((selectedEmployee) => selectedEmployee.id === id);
            if (!selectedEmployee) continue;

            if (selectedEmployee.status === "DELETED") {
                Swal.fire({
                    title: "Error",
                    text: "Employee already deleted",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: '#1976D2',
                });
                setIsDeleting(false);
                return;
            }


            try {
                const result = await Swal.fire({
                    title: "Please Confirm Deletion of:  \n" + selectedEmployee.name + " " + selectedEmployee.surname,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Confirm",
                    input: "radio",
                    confirmButtonColor: '#1976D2',

                });

                if (result.isConfirmed) {


                    //fetch
                    const response = await dispatch(fetchDeleteEmployeeByAdmin({
                        token: token,
                        id: selectedEmployee.id,

                    })).then(data => {
                        if (data.payload.message) {
                            Swal.fire({
                                title: "Error",
                                text: data.payload.message,
                                icon: "error",
                                confirmButtonText: "OK",
                                confirmButtonColor: '#1976D2',

                            });
                            return
                        }
                        Swal.fire({
                            title: "Success",
                            text: "Deletion completed",
                            icon: "success",
                            confirmButtonText: "OK",
                            confirmButtonColor: '#1976D2',
                        });

                        fetchGetAllUsersOfManager({
                            token: token,
                            page: 0,
                            pageSize: 100,
                            searchText: searchText,
                        })
                    })

                }
            } catch (error) {
                localStorage.removeItem("token");
                dispatch(clearToken());
            }
        }

        setIsDeleting(false);
    };

    const handleActivateEmployee = async () => {
        setIsActivating(true);

        for (let id of selectedRowIds) {
            const selectedEmployee = userList.find((selectedEmployee) => selectedEmployee.id === id);
            if (!selectedEmployee) continue;

            if (selectedEmployee.status === "ACTIVE") {
                Swal.fire({
                    title: "Error",
                    text: "Employee already active",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: '#1976D2',
                });
                setIsActivating(false);
                return;
            }


            try {
                const result = await Swal.fire({
                    title: "Please Confirm Activation of:  \n" + selectedEmployee.name + " " + selectedEmployee.surname,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Confirm",
                    input: "radio",
                    confirmButtonColor: '#1976D2',

                });

                if (result.isConfirmed) {


                    //fetch
                    const response = await dispatch(fetchActivateUserByManager({
                        token: token,
                        id: selectedEmployee.id,

                    })).then(data => {
                        if (data.payload.message) {
                            Swal.fire({
                                title: "Error",
                                text: data.payload.message,
                                icon: "error",
                                confirmButtonText: "OK",
                                confirmButtonColor: '#1976D2',

                            });
                            return
                        }
                        Swal.fire({
                            title: "Success",
                            text: "Activation has been competed",
                            icon: "success",
                            confirmButtonText: "OK",
                            confirmButtonColor: '#1976D2',
                        });

                        fetchGetAllUsersOfManager({
                            token: token,
                            page: 0,
                            pageSize: 100,
                            searchText: searchText,
                        })
                    })

                }
            } catch (error) {
                localStorage.removeItem("token");
                dispatch(clearToken());
            }
        }

        setIsActivating(false);
    };


    return (
        <div style={{ height: "auto", width: "inherit" }}>
            <TextField
                label="Search By Email"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{ marginBottom: "1%", marginTop: "1%" }}
                fullWidth
                inputProps={{ maxLength: 50 }}
            />
            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={userList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={handleRowSelection}
                sx={{
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "rgba(224, 224, 224, 1)",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        textAlign: "center",
                        fontWeight: "bold",
                    },
                    "& .MuiDataGrid-cell": {
                        textAlign: "center",
                    },
                    height: '407px'
                }}
            />
            <Grid sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '2%', marginBottom: '2%' }}>
                <Button
                    onClick={handleActivateEmployee}
                    variant="contained"
                    color="primary"
                    disabled={isActivating || selectedRowIds.length === 0}
                    sx={{ marginRight: '1%', width: '200px' }}
                    startIcon={<Icons.ActivateIcon />}
                >
                    Activate
                </Button>
                <Button
                    onClick={handleDeleteEmployee}
                    variant="contained"
                    color="error"
                    disabled={isDeleting || selectedRowIds.length === 0}
                    sx={{ marginRight: '1%', width: '200px' }}
                    startIcon={<Icons.DeleteIcon />}
                >
                    Delete
                </Button>
                <Button
                    onClick={handleOnClickEditEmployee}
                    variant="contained"
                    color="secondary"
                    disabled={selectedRowIds.length > 1 || selectedRowIds.length === 0}
                    sx={{ marginRight: '1%', width: '200px' }}
                    startIcon={<Icons.EditIcon />}
                >
                    Edit Employee
                </Button>
                <Button
                    onClick={handleOnClickAddDocument}
                    variant="contained"
                    color="success"
                    disabled={selectedRowIds.length > 1 || selectedRowIds.length === 0}
                    sx={{ marginRight: '1%', width: '200px' }}
                    startIcon={<Icons.AddDocumentIcon />}
                >
                    Add Document
                </Button>
                <Button
                    onClick={openAddBonus}
                    variant="contained"
                    color="success"
                    disabled={selectedRowIds.length > 1 || selectedRowIds.length === 0}
                    sx={{ marginRight: '1%', width: '200px' }}
                    startIcon={<Icons.BonusIcon />}
                >
                    Add Bonus
                </Button>
                <Button
                    onClick={handleSetShifts}
                    variant="contained"
                    color="success"
                    disabled={selectedRowIds.length > 1 || selectedRowIds.length === 0}
                    sx={{ marginRight: '1%', width: '200px' }}
                    startIcon={<Icons.SetShiftIcon />}
                >
                    Set Shifts
                </Button>
                <Button
                    onClick={handleAssignItem}
                    variant="contained"
                    color="success"
                    disabled={selectedRowIds.length > 1 || selectedRowIds.length === 0}
                    sx={{ marginRight: '1%', width: '200px' }}
                    startIcon={<Icons.AssignItemIcon />}
                >
                    Assign Item
                </Button>
            </Grid>
            <AddDocument open={openAddDocument} onClose={handleCloseAddDocument} />
            <AddBonus
                open={open}
                onClose={handleClose}
                selectedUser={selectedUser}
                description={description}
                setDescription={setDescription}
                bonusAmount={bonusAmount}
                setBonusAmount={setBonusAmount}
                bonusDate={bonusDate}
                setBonusDate={setBonusDate}
                handleAddBonus={handleAddBonus}
                loading={loading}
            />
        </div>
    );
}

