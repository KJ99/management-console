import { ArrowLeft, ChevronLeft, Edit } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { FormikProps } from "formik";
import { NavLink } from "react-router-dom";
import ConditionalView from "../components/ConditionalView";
import ProfileEditForm, { ProfileFormModel } from "../components/forms/ProfileEditForm";
import Page from "../components/Page";
import PageLoader from "../components/PageLoader";
import ProfilePicture from "../components/ProfilePicture";
import User from "../models/profile/User";
import panelDashboard from "../resources/styles/layouts/WorkspaceDashboard";
import styleSheet from '../resources/styles/pages/ProfilePage'

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    profile?: User,
    loaded: boolean,
    editMode: boolean,
    onEnterEditMode: () => void,
    onQuitEditMode: () => void,
    formik: FormikProps<ProfileFormModel>
    returnUrl: string
};

const ProfilePage = ({
    strings, 
    profile, 
    loaded,
    editMode,
    onEnterEditMode,
    onQuitEditMode,
    formik,
    returnUrl
}: Props) => {
    const panelClasses = panelDashboard();
    const classes = styleSheet();
    return (
        <Page title={strings('/profile/title')}>
            <Box className={panelClasses.pageHeader}>
                <Box className={panelClasses.pageTitleArea}>
                    <Button
                        variant="text"
                        color="info"
                        startIcon={<ChevronLeft />}
                        component={NavLink}
                        to={returnUrl}
                    >
                        {strings('/base/back')}
                    </Button>
                    <Typography className={panelClasses.pageTitle}>
                        {strings('/profile/title')}
                    </Typography>
                </Box>
                <Box className={panelClasses.pageActionsArea}>
                    {
                        loaded && !editMode && (
                            <Button
                                variant="contained"
                                startIcon={<Edit />}
                                color="primary"
                                className={panelClasses.pageAction}
                                onClick={onEnterEditMode}
                            >
                                {strings('/base/edit')}
                            </Button>
                        )
                    }
                </Box>
            </Box>
            <ConditionalView condition={loaded} otherwise={<PageLoader />}>
                <Grid container direction="column" spacing={3} alignItems="center">
                    <ConditionalView
                        condition={!editMode}
                        otherwise={
                            <Grid item xs={6}>
                                <Card>
                                    <CardHeader title={strings('/profile/edit-title')} />
                                    <CardContent>
                                        <ProfileEditForm
                                            strings={strings}
                                            formik={formik}
                                            onCancel={onQuitEditMode}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        }
                    >
                        <>
                            <Grid item>
                                <ProfilePicture
                                    user={profile}
                                    variant="large"
                                />
                            </Grid>
                            <Grid item>
                                <Typography variant="body2">
                                    @{profile?.username}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography className={classes.name}>
                                    {profile?.firstName} {profile?.lastName}
                                </Typography>
                            </Grid>
                        </>
                    </ConditionalView>
                </Grid>
            </ConditionalView>
        </Page>
    )
}

ProfilePage.defaultProps = {
    strings: (name: any, ...args: any[]) => '',
    loaded: false,
    editMode: false,
    onEnterEditMode: () => {},
    onQuitEditMode: () => {},
    formik: {},
    returnUrl: '/'
}

export default ProfilePage;