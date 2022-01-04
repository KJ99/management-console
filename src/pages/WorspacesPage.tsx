import { Button, ButtonBase, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ConditionalView from "../components/ConditionalView";
import Page from "../components/Page";
import PageLoader from "../components/PageLoader";
import Team from "../models/team/Team";
import styleSheet from '../resources/styles/pages/WorkspacesPage';
import { GroupAdd, Person, Add } from '@mui/icons-material';
import { FormikProps } from "formik";
import TeamModel from "../models/team/TeamModel";
import WorkspaceForm, { WorkspaceFormModel } from "../components/forms/WorkspaceForm";
import { LoadingButton } from "@mui/lab";
import InviteCodeForm, { InviteCodeFormModel } from "../components/forms/InviteCodeForm";
import Invitation from "../models/invitations/Invitation";
import { useEffect } from "react";
import { v4 } from "uuid";
import WorkspacePicture from "../components/WorkspacePicture";
import { Link } from "react-router-dom";
import { preparePath } from "../utils/PathUtil";
import paths from '../routings/paths.json';

export type Props = {
    loaded: boolean,
    pageLoading: boolean,
    workspaces: Team[],
    hasNextPage: boolean,
    createDialogOpen: boolean,
    createWorkspaceFormik: FormikProps<WorkspaceFormModel>,
    onCreateDialogClose: () => void,
    onCreateWorkspace: () => void,
    strings: (name?: string, ...args: string[]) => string,
    onJoinWorkspace: () => void,
    onCodeDialogClose: () => void,
    inviteCodeFormik: FormikProps<InviteCodeFormModel>,
    codeDialogOpen: boolean,
    invitation: Invitation|null,
    onJoinConfirm: () => void,
    onJoinCancel: () => void,
    onNextPage: () => void,
}

const WorkspacesPage = ({
    strings,
    createWorkspaceFormik,
    workspaces,
    loaded,
    createDialogOpen,
    onCreateDialogClose,
    onCreateWorkspace,
    onJoinWorkspace,
    onCodeDialogClose,
    inviteCodeFormik,
    codeDialogOpen,
    invitation,
    onJoinConfirm,
    onJoinCancel,
    hasNextPage,
    onNextPage
}: Props) => {
    const classes = styleSheet();
    useEffect(() => console.log(workspaces), [workspaces]);
    return (
        <Page title={strings("/workspaces/title")}>
            <ConditionalView condition={loaded} otherwise={<PageLoader />}>
                <Grid container spacing={6}>
                    <Grid item>
                        <Button 
                            startIcon={<Add />}
                            className={classes.listActionCard}
                            onClick={onCreateWorkspace}
                        >
                            {strings("/workspaces/create")}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            startIcon={<GroupAdd />} 
                            className={classes.listActionCard}
                            onClick={onJoinWorkspace}
                        >
                            {strings("/workspaces/join")}
                        </Button>
                    </Grid>
                    {workspaces.map((workspace) => (
                        <Grid item key={v4()}>
                            <Link to={preparePath(paths.app.workspaces.dashboard, { id: workspace.id })}>
                                <ButtonBase>
                                    <Card className={classes.workspaceCard}>
                                        <CardMedia>
                                            <WorkspacePicture 
                                                className={classes.workspaceImage} 
                                                workspace={workspace}
                                            />
                                        </CardMedia>
                                        <CardContent>
                                            <Typography className={classes.workspaceName}>
                                                {workspace?.name}
                                            </Typography>
                                            <Box className={classes.workspaceRolesContainer}>
                                                <Person className={classes.rolesIcon} />
                                                <Typography className={classes.workspaceRoles}>
                                                    {workspace?.roles?.join(', ')}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </ButtonBase>
                            </Link>
                        </Grid>
                    ))}
                    <ConditionalView condition={hasNextPage}>
                        <Grid item className={classes.nextPageContainer}>
                            <Button
                                variant="text"
                                color="info"
                                onClick={onNextPage}
                            >
                                Show More
                            </Button>
                        </Grid>
                    </ConditionalView>
                </Grid>
            </ConditionalView>
            <Dialog 
                open={createDialogOpen} 
                onClose={onCreateDialogClose}
            >
                <DialogTitle>
                    {strings("/workspaces/create")}
                </DialogTitle>
                <DialogContent>
                    <Box mt={3}>
                        <WorkspaceForm
                            strings={strings}
                            formik={createWorkspaceFormik}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="info"
                        onClick={onCreateDialogClose}
                    >
                        {strings('/base/cancel')}
                    </Button>
                    <LoadingButton
                        variant="contained"
                        loading={createWorkspaceFormik.isSubmitting}
                        color="primary"
                        onClick={() => createWorkspaceFormik.submitForm()}
                    >
                        {strings('/base/save')}
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <Dialog open={codeDialogOpen} onClose={onCodeDialogClose}>
                <DialogTitle>
                    {strings("/workspaces/join")}
                </DialogTitle>
                <DialogContent>
                    <Box mt={3}>
                        <InviteCodeForm
                            formik={inviteCodeFormik} 
                            strings={strings}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="info"
                        onClick={onCreateDialogClose}
                    >
                        {strings('/base/cancel')}
                    </Button>
                    <LoadingButton
                        variant="contained"
                        loading={inviteCodeFormik.isSubmitting}
                        color="primary"
                        onClick={() => inviteCodeFormik.submitForm()}
                    >
                        {strings('/base/next')}
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <Dialog open={invitation != null} onClose={onJoinCancel}>
                <DialogTitle>
                    {strings("/workspaces/join-confirm")}
                </DialogTitle>
                <DialogContent className={classes.confirmJoinDialogContent}>
                    <ConditionalView condition={invitation?.team?.pictureUrl != null}>
                        <img
                            className={classes.workspaceJoinImage}
                            src={invitation?.team?.pictureUrl}
                            alt="picture"
                        />
                    </ConditionalView>
                    <Typography className={classes.workspaceToJoinTitle}>
                        {invitation?.team?.name}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="info"
                        onClick={onJoinCancel}
                    >
                        {strings('/base/cancel')}
                    </Button>
                    <LoadingButton
                        variant="contained"
                        loading={inviteCodeFormik.isSubmitting}
                        color="primary"
                        onClick={onJoinConfirm}
                    >
                        {strings('/base/confirm')}
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Page>
    );
}

WorkspacesPage.defaultProps = {
    loaded: false,
    pageLoading: false,
    workspaces: [],
    hasNextPage: false,
    createDialogOpen: false,
    createWorkspaceFormik: {},
    onCreateDialogClose: () => {},
    onCreateWorkspace: () => {},
    strings: (name?: string, ...args: string[]) => '',
    onJoinWorkspace: () => {},
    onCodeDialogClose: () => {},
    inviteCodeFormik: {},
    codeDialogOpen: false,
    invitation: null,
    onJoinConfirm: () => {},
    onJoinCancel: () => {},
    onNextPage: () => {}
}

export default WorkspacesPage;