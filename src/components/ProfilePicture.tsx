import Profile from "../models/profile/Profile";
import User from "../models/profile/User";
import styleSheet from "../resources/styles/components/ProfilePicture";
import clsx from 'clsx';
import { Box, Typography } from "@mui/material";
import ConditionalView from "./ConditionalView";
import Member from "../models/member/Member";

export type Props = {
    variant: string,
    user?: Profile|User|Member
}

const getUserInitials = (user?: Profile|User|Member): string => {
    const firstInitial: string = user?.firstName?.charAt(0) ?? '';
    const lastInitial: string = user?.lastName?.charAt(0) ?? '';

    return `${firstInitial}${lastInitial}`.toUpperCase();
}

const ProfilePicture = ({ variant, user }: Props) => {
    const classes = styleSheet();
    return (
        <Box
            className={
                clsx(classes.root, {
                    [classes.small]: variant === 'small',
                    [classes.normal]: variant === 'normal',
                    [classes.large]: variant === 'large'
                })
            }
        >
            <ConditionalView 
                condition={user?.pictureUrl != null}
                otherwise={
                    <Box className={classes.avatar}>
                        <Typography className={classes.initials}>
                            {getUserInitials(user)}
                        </Typography>
                    </Box>
                }
            >
                <img
                    className={classes.image}
                    src={user?.pictureUrl}
                    alt="profile picture"
                />
            </ConditionalView>
        </Box>
    );
}

ProfilePicture.defaultProps = {
    variant: 'normal'
}

export default ProfilePicture;