import React, {useState, useEffect} from 'react';
import {TextField, Grid, Button} from '@mui/material';
import {HumanResources, useAppSelector} from "../../../store";
import {useDispatch} from "react-redux";
import {
    fetchDeletePersonalDocument,
    fetchPersonalDocuments,
} from "../../../store/feature/personalDocumentSlice";
import {DataGrid, GridColDef, GridRowSelectionModel} from "@mui/x-data-grid";
import DownloadButtonFromS3 from "../../atoms/DownloadButtonFromS3";
import {fetchDeleteHoliday, fetchHolidaysUser} from "../../../store/feature/holidaySlice";
import Swal from "sweetalert2";

const columns: GridColDef[] = [

    {field: "id", headerName: "Id", flex: 1, headerAlign: "center"},
    {field: "email", headerName: "Email", flex: 1, headerAlign: "center"},
    {field: "description", headerName: "Description", flex: 1, headerAlign: "center"},
    {field: "documentType", headerName: "Document Type", flex: 1, headerAlign: "center"},
    {
        field: "attachedFile", headerName: "Document", headerAlign: "center", flex: 1,
        renderCell: (params) => (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
            }}>
                {params.value && <DownloadButtonFromS3 fileKey={params.value}/>}
            </div>
        )
    },

];
const SideBarPersonalDocumentList: React.FC = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const token = useAppSelector((state) => state.auth.token);
    const employeeId = useAppSelector((state) => state.auth.selectedEmployeeId);
    const dispatch = useDispatch<HumanResources>();
    const [personalDocuments, setPersonelDocuments] = useState([]);
    const [searchText, setSearchText] = useState('');


    useEffect(() => {
        dispatch(fetchPersonalDocuments({
            token: token,
            page: 0,
            searchText: searchText,
            pageSize: 100,
        })).then(data => {
            setPersonelDocuments(data.payload);
        })

    }, [dispatch, token, searchText]);


    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleDelete = () => {
        selectedRowIds.forEach((id) => {
            dispatch(fetchDeletePersonalDocument({id, token}))
                .then(() => {
                    dispatch(fetchPersonalDocuments({
                        token: token,
                        page: 0,
                        searchText: searchText,
                        pageSize: 100,
                    })).then(data => {
                        if (data.payload.message) {
                            Swal.fire({
                                icon: 'error',
                                text: data.payload.message ?? 'Failed to delete document',
                                showConfirmButton: true
                            })
                        }else{
                            Swal.fire({
                                icon: 'success',
                                text: 'Document has been deleted',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                        setPersonelDocuments(data.payload);
                    })
                });
        });
    };

    return (
        <div style={{height: 400, width: "inherit"}}>
            <TextField
                label="Email"
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{marginBottom: "10px"}}
            />
            <DataGrid
                rows={personalDocuments}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 5},
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
                }}
            />
            <Grid container spacing={1} style={{ marginTop: 16 }} direction="row">
                <Grid item>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={selectedRowIds.length === 0}
                    >
                        Delete Document
                    </Button>
                </Grid>
            </Grid>
        </div>


    );
};

export default SideBarPersonalDocumentList;