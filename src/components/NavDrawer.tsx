import { Menu } from "@mui/icons-material";
import { Drawer, Hidden, IconButton, SwipeableDrawer } from "@mui/material";
import clsx from "clsx";
import { useState } from "react";
import styleSheet from "../resources/styles/components/NavDrawer";
import { MenuTrigger } from "./TopBar";
import { isIOS } from 'react-device-detect';

const Content = () => {
    return <p>XDD</p>
}

const NavDrawer = () => {
    const classes = styleSheet();
    const [open, setOpen] = useState(false);
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
                    <Content />
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
                    <Content />
                </Drawer>
            </Hidden>
        </>
    );
}

export default NavDrawer;