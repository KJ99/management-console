import { Fragment } from "react";
import { Outlet } from "react-router";
import NavDrawer from "../components/NavDrawer";

const WorkspaceDashboard = () => {
    return (
        <Fragment>
            <NavDrawer />
            <Outlet />
        </Fragment>
    );
}

export default WorkspaceDashboard;