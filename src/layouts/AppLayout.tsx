import { FC } from "react";
import { Outlet } from "react-router";
import TopBar from "../components/TopBar";
import styleSheet from "../resources/styles/layouts/AppLayout";

const AppLayout: FC = ({ children }) => {
    const classes = styleSheet();
    return (
        <>
            <TopBar className={classes.topBar} />
            <section className={classes.wrapper}>
                <Outlet />
            </section>
        </>
    )
}

export default AppLayout;