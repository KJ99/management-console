import { Box, Button, Hidden } from '@mui/material';
import styleSheet from '../resources/styles/components/TopBar';
import Logo from '../resources/assets/app-logo.png';
import { useEffect, useMemo, ReactNode, useContext } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../contexts/AuthContext';
import ConditionalView from './ConditionalView';
import ProfilePicture from './ProfilePicture';
const MenuTriggerId = 'top-bar-menu-trigger';

export type MenuTriggerProps = {
    children: ReactNode
}

export const MenuTrigger = ({ children }: MenuTriggerProps) => {
    const element = useMemo(() => document.createElement('section'), []);
    useEffect(() => {
        document.getElementById(MenuTriggerId)?.appendChild(element);
    }, []);

    return createPortal(children, element);
};

const TopBar = () => {
    const classes = styleSheet();
    const { user } = useContext(AuthContext);
    return (
        <Box className={classes.root}>
            <Box className={classes.logoContainer}>
                <section className={classes.menuTriggerContainer} id={MenuTriggerId} />
                <img src={Logo} className={classes.logo} />
            </Box>
            <Box className={classes.profileContainer}>
                <ConditionalView condition={user != null}>
                    <ProfilePicture user={user!} />
                </ConditionalView>
            </Box>
        </Box>
    );
};

export default TopBar;
