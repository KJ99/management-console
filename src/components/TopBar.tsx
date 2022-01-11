import { Box, Button, ButtonBase, ClickAwayListener, FormControlLabel, Grow, Hidden, IconButton, MenuItem, Paper, Popover, Popper, Switch } from '@mui/material';
import styleSheet from '../resources/styles/components/TopBar';
import Logo from '../resources/assets/app-logo.png';
import { useEffect, useMemo, ReactNode, useContext, useRef, useState, useCallback, FC } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../contexts/AuthContext';
import ConditionalView from './ConditionalView';
import ProfilePicture from './ProfilePicture';
import { Edit, Logout, Settings } from '@mui/icons-material';
import { StringsContext } from '../contexts/StringsContext';
import { SettingsContext } from '../contexts/SettingsContext';
import ProfileClient from '../infrastructure/clients/identity-server/ProfileClient';
import { NightModeStorageKey } from '../themes/color-schemes';
import { NavLink, useLocation } from 'react-router-dom';
import paths from '../routings/paths.json';
import clsx from 'clsx';

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

export type Props = {
    className?: string
}

const TopBar = ({ className }: Props) => {
    const classes = styleSheet();
    const location = useLocation();
    const currentPath = useMemo(() => location.pathname, [location.pathname]);
    const { user, deauthenticate } = useContext(AuthContext);
    const { strings } = useContext(StringsContext);
    const { nightMode, setNightMode } = useContext(SettingsContext);
    const anchorRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const handleNightModeToggle = useCallback(
        async (_, checked) => {
            let newVal = !nightMode;
            if (user != null) {
                const client = new ProfileClient();
                await client.updateSettings(user, { nightMode: newVal });
            }
            localStorage.setItem(NightModeStorageKey, newVal ? '1': '0');
            setNightMode(newVal);
        },
        [setNightMode, nightMode, user]
    );

    const handleLogout = useCallback(() => {
        deauthenticate();
    }, [deauthenticate])
    return (
        <Box className={clsx(classes.root, className)}>
            <Box className={classes.logoContainer}>
                <section className={classes.menuTriggerContainer} id={MenuTriggerId} />
                <img src={Logo} className={classes.logo} />
            </Box>
            <Box className={classes.profileContainer}>
                <IconButton ref={anchorRef} onClick={() => setMenuOpen(true)}>
                    <ConditionalView 
                        condition={user != null}
                        otherwise={
                            <Settings />
                        }
                    >
                        <ProfilePicture user={user!} />
                    </ConditionalView>
                </IconButton>
            </Box>
            <Popper
                open={menuOpen}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}

                    >
                        <Paper>
                            <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
                                <Box>
                                    {user != null && (
                                        <MenuItem 
                                            className={classes.menuItem}
                                            component={NavLink}
                                            to={paths.app.profile.details}
                                            state={{ returnUrl: currentPath }}
                                        >
                                            <Edit />
                                            {strings('/profile/edit')}
                                        </MenuItem>
                                    )}
                                    <Box className={classes.menuItem}>
                                        <FormControlLabel
                                            label={strings('/profile/night-mode')}
                                            control={
                                                <Switch
                                                    checked={nightMode}
                                                    onChange={handleNightModeToggle}
                                                />
                                            }
                                        />
                                    </Box>
                                    {user != null && (
                                        <MenuItem className={classes.menuItem} onClick={handleLogout} >
                                            <Logout />
                                            {strings('/profile/logout')}
                                        </MenuItem>
                                    )}
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Box>
    );
};

export default TopBar;
