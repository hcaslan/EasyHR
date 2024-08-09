import { Grid} from "@mui/material";
import { useAppSelector} from "../../store";
import SideBarOffers from "../molecules/AdminPageComponents/SideBarOffers";
import SideBarCreateFeature  from "../molecules/AdminPageComponents/SideBarCreateFeature";
import CreateAdminMenuContent  from "../molecules/AdminPageComponents/SideBarCreateAdmin";
import SideBarProfile from "../molecules/SideBarProfile";
import SideBarUsers from "../molecules/AdminPageComponents/SideBarUsers";
import CompanyList from "../molecules/AdminPageComponents/SideBarCompanies";
import SideBarAddEmployee from "../molecules/ManagerComponents/SideBarAddEmployee";
import SideBarEmployees from "../molecules/ManagerComponents/SideBarEmployees";
import {lazy} from "react";
import ChangePassword from "../molecules/ChangePassword";
import SideBarHolidayTableAdmin from "../molecules/AdminPageComponents/SideBarHolidayTableAdmin";
const EditEmployee = lazy(() => import('../molecules/ManagerComponents/EditEmployee'));
const SideBarCreateComment = lazy(() => import('../molecules/ManagerComponents/SideBarCreateComment'));
export const AdminMenuContentRenderer = () => {
    const page = useAppSelector((state) => state.auth.pageState);

    return (
        <>
            <Grid item xs={12}>
                {page === 'Offers' && <SideBarOffers />}
                {page === 'Create Admin' && <CreateAdminMenuContent />}
                {page === 'Create Feature' && <SideBarCreateFeature />}
                {page === 'Holidays' && <SideBarHolidayTableAdmin />}
                {page === 'Profile' && <SideBarProfile/>}
                {page === 'Companies' && <CompanyList/>}
                {page === 'Users' && <SideBarUsers/>}
                {page === 'Add Employee' && <SideBarAddEmployee/>}
                {page === 'Employees' && <SideBarEmployees/>}
                {page === 'Edit Employee' && <EditEmployee/>}
                {page === 'Change Password' && <ChangePassword/>}
                {page === 'Add Comment' && <SideBarCreateComment/>}
            </Grid>
        </>
    );
};

