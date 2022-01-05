import { Menu, Person, PersonAdd, PersonOutline } from "@mui/icons-material";
import { Box, Collapse, Drawer, Hidden, IconButton, Link, List, SwipeableDrawer, Typography } from "@mui/material";
import { ExitToApp } from '@mui/icons-material';
import clsx from "clsx";
import { useContext, useState } from "react";
import styleSheet from "../../resources/styles/components/nav/NavDrawer";
import { MenuTrigger } from "../TopBar";
import { isIOS } from 'react-device-detect';
import { SettingsContext } from "../../contexts/SettingsContext";
import Team from "../../models/team/Team";
import ConditionalView from "../ConditionalView";
import WorkspacePicture from "../WorkspacePicture";
import NavElement from "./NavElement";
import createNav from "../../utils/createNav";
import paths from '../../routings/paths.json';
import PerfectScrollbar from 'react-perfect-scrollbar'; 
import 'react-perfect-scrollbar/dist/css/styles.css';
import { v4 } from "uuid";
import { NavLink } from "react-router-dom";

export type Props = {
    workspace?: Team
}

const Content = ({ workspace }: Props) => {
    const classes = styleSheet({});
    return (
        <Box className={classes.contentRoot}>
            <Box className={classes.header}>
                <ConditionalView condition={workspace != null}>
                    <WorkspacePicture
                        className={classes.picture}
                        workspace={workspace}
                    />
                </ConditionalView>
                <Typography className={classes.workspaceName}>
                    {workspace?.name}
                </Typography>
                <Link component={NavLink} to={paths.app.workspaces.index} className={classes.changeWorkspaceLink}>
                    Change workspace
                </Link>
            </Box>
            <PerfectScrollbar>
                <List>
                    {createNav(workspace?.id).map((item) => <NavElement key={v4()} {...item} />)}
                </List>
            </PerfectScrollbar>
        </Box>
        
    )
};

const NavDrawer = (props: Props) => {
    const classes = styleSheet({});
    const [open, setOpen] = useState(false);
    const { nightMode } = useContext(SettingsContext);
    return (
        <>
            <Hidden mdUp>
                <MenuTrigger>
                    <IconButton onClick={() => setOpen(!open)}>
                        <Menu />
                    </IconButton>
                </MenuTrigger>
                <SwipeableDrawer
                    disableBackdropTransition={!isIOS}
                    disableDiscovery={isIOS}
                    classes={{
                        paper: classes.root
                    }}
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                >
                    <Content { ...props } />
                </SwipeableDrawer>
            </Hidden>
            <Hidden mdDown>
                <Drawer
                    classes={{
                        paper: clsx(classes.root, classes.pernamentPaper)
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <Content { ...props } />
                </Drawer>
            </Hidden>
        </>
    );
}

export default NavDrawer;