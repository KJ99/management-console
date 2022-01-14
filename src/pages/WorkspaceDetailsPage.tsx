import { Edit, Home, Person, PersonAdd, PersonOff, PersonRemove } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Link, Typography } from "@mui/material";
import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { v4 } from "uuid";
import ConditionalView from "../components/ConditionalView";
import Page from "../components/Page";
import PageLoader from "../components/PageLoader";
import ProfilePicture from "../components/ProfilePicture";
import WorkspacePicture from "../components/WorkspacePicture";
import WorkspaceTheme from "../extension/WorkspaceTheme";
import Member from "../models/member/Member";
import Team from "../models/team/Team";
import styleSheet from "../resources/styles/pages/WorkspaceDetailsPage";
import panelDashboard from "../resources/styles/layouts/WorkspaceDashboard";
import paths from '../routings/paths.json';
import * as ColorSchemes from '../themes/color-schemes';
import QRCode from "react-qr-code";
import { FormikProps } from "formik";
import MemberRolesForm, { MemberRolesFormModel } from "../components/forms/MemberRolesForm";
import WorkspaceRole from "../extension/WorkspaceRole";
import RestrictedView from "../components/RestrictedView";
import WorkspaceForm, { WorkspaceFormModel } from "../components/forms/WorkspaceForm";
import { LoadingButton } from "@mui/lab";

export type Props = {
    strings: (name?: string, ...args: any[]) => string
    workspace?: Team,
    members: Member[],
    loaded: boolean,
    onInvite: () => void,
    onInvitationCancel: () => void,
    invitationPin?: string,
    focusedMember?: Member,
    onMemberEdit: (member: Member) => void,
    onMemberEditCancel: () => void,
    memberRolesFormik: FormikProps<MemberRolesFormModel>,
    memberToRemove?: Member,
    onMemberToRemoveSelect: (member: Member) => void,
    onMemberRemoveCancel: () => void,
    onMemberRemoveConfirm: () => void,
    editMode: boolean,
    onEnterEditMode: () => void,
    onQuitEditMode: () => void,
    workspaceEditFormik: FormikProps<WorkspaceFormModel>
}

interface ThemeData {
    colorScheme: ColorSchemes.ColorScheme,
    name: string
}

const getThemeData = (workspace?: Team): ThemeData => {
    let result;
    const theme: any = workspace?.settings?.theme ?? WorkspaceTheme.SEA;
    switch(theme) {
        case WorkspaceTheme[WorkspaceTheme.DESK]:
            result = {
                colorScheme: ColorSchemes.Desk,
                name: "/themes/desk"
            }
            break;
        case WorkspaceTheme[WorkspaceTheme.GRASSLAND]:
            result = {
                colorScheme: ColorSchemes.Grassland,
                name: "/themes/grassland"
            }
            break;
        case WorkspaceTheme[WorkspaceTheme.UNICORN]:
            result = {
                colorScheme: ColorSchemes.Unicorn,
                name: "/themes/unicorn"
            }
            break;
        default:
            result = {
                colorScheme: ColorSchemes.Sea,
                name: "/themes/sea"
            }
            break;
    }

    return result;
}

const WorkspaceDetailsPage = ({ 
    workspace, 
    members, 
    strings, 
    loaded,
    onInvite,
    onInvitationCancel,
    invitationPin,
    focusedMember,
    onMemberEdit,
    onMemberEditCancel,
    memberRolesFormik,
    memberToRemove,
    onMemberToRemoveSelect,
    onMemberRemoveCancel,
    onMemberRemoveConfirm,
    editMode,
    onEnterEditMode,
    onQuitEditMode,
    workspaceEditFormik
}: Props) => {
    const themeInfo = useMemo(() => getThemeData(workspace), [workspace]);
    const panelClasses = panelDashboard();
    const classes = styleSheet({ colorScheme: themeInfo.colorScheme });
    return (
        <Page title={strings('/workspaces/details-title', workspace?.name)}>
            <Box className={panelClasses.pageHeader}>
                <Box className={panelClasses.pageTitleArea}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link 
                            className={panelClasses.breadcrumbsItem} 
                            component={NavLink} 
                            to={paths.app.workspaces.index}
                        >
                            {strings('/workspaces/title')}
                        </Link>
                        <Typography className={panelClasses.currentBreadcrumbsItem}>
                            {workspace?.name}
                        </Typography>
                    </Breadcrumbs>
                    <Typography className={panelClasses.pageTitle}>
                        {strings('/workspaces/details-title', workspace?.name)}
                    </Typography>
                </Box>
                <Box className={panelClasses.pageActionsArea}>
                    <RestrictedView permittedRoles={[WorkspaceRole.OWNER, WorkspaceRole.ADMIN]}> 
                        <Button
                            variant="contained"
                            startIcon={<PersonAdd />}
                            color="primary"
                            className={panelClasses.pageAction}
                            onClick={onInvite}
                        >
                            {strings('/workspaces/invite')}
                        </Button>
                    </RestrictedView>
                </Box>
            </Box>
            <ConditionalView condition={loaded} otherwise={<PageLoader />}>
                <Box>
                    <Card>
                        <CardHeader
                            title={strings('/workspaces/general-info')}
                            action={
                                editMode ? (
                                    <RestrictedView permittedRoles={[WorkspaceRole.OWNER, WorkspaceRole.ADMIN]}>
                                        <Grid container spacing={1}>
                                            <Grid item>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={onQuitEditMode}
                                                >
                                                    {strings('/base/cancel')}
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <LoadingButton
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={workspaceEditFormik.submitForm}
                                                    loading={workspaceEditFormik.isSubmitting}
                                                >
                                                    {strings('/base/save')}
                                                </LoadingButton>
                                            </Grid>
                                        </Grid>
                                    </RestrictedView>
                                ) : (
                                    <RestrictedView permittedRoles={[WorkspaceRole.OWNER, WorkspaceRole.ADMIN]}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<Edit />}
                                            onClick={onEnterEditMode}
                                        >
                                            {strings('/base/edit')}
                                        </Button>
                                    </RestrictedView>
                                )
                            }
                        />
                        <ConditionalView condition={!editMode}>
                            <CardMedia>
                                <WorkspacePicture
                                    workspace={workspace}
                                    className={classes.workspaceImage}
                                />
                            </CardMedia>
                        </ConditionalView>
                        <CardContent>
                            <ConditionalView
                                condition={!editMode}
                                otherwise={
                                    <WorkspaceForm
                                        strings={strings}
                                        formik={workspaceEditFormik}
                                    />
                                }
                            >
                                <>
                                    <Typography className={classes.workspaceName}>
                                        {workspace?.name}
                                    </Typography>
                                    <Box className={classes.themePreviewContainer}>
                                        <Box className={classes.themePreviewBox} />
                                        <Typography>
                                            {strings(themeInfo.name)}
                                        </Typography>
                                    </Box>
                                </>
                            </ConditionalView>
                        </CardContent>
                    </Card>
                    <Box className={classes.membersSection}>
                        <Typography variant="h5">{strings('/workspaces/members-title')}</Typography>
                        {members.map((member) => (    
                            <Card key={v4()} className={classes.memberCard}>
                                <CardMedia className={classes.memberPictureContainer}>
                                    <ProfilePicture
                                        variant="large"
                                        user={member}
                                    />
                                </CardMedia>
                                <CardContent className={classes.memberCardContent}>
                                    <Typography className={classes.memberName}>
                                        {member.firstName} {member.lastName}
                                    </Typography>
                                    <Box className={classes.rolesContainer}>
                                        <Person className={classes.rolesIcon} />
                                        <Typography>
                                            {member.roles?.map((role) => role.name).join(', ')}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <RestrictedView permittedRoles={[WorkspaceRole.OWNER, WorkspaceRole.ADMIN]}> 
                                    <CardActions className={classes.memberActionsContainer}>
                                        <Button
                                            variant="contained"
                                            startIcon={<Edit />}
                                            color="primary"
                                            className={classes.memberAction}
                                            onClick={() => onMemberEdit(member)}
                                        >
                                            {strings('/workspaces/roles')}
                                        </Button>
                                        <ConditionalView condition={!member.hasRole(WorkspaceRole.OWNER)}>
                                            <Button
                                                variant="contained"
                                                startIcon={<PersonRemove />}
                                                color="error"
                                                className={classes.memberAction}
                                                onClick={() => onMemberToRemoveSelect(member)}
                                            >
                                                {strings('/workspaces/remove')}
                                            </Button>
                                        </ConditionalView>
                                    </CardActions>
                                </RestrictedView>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </ConditionalView>
            <Dialog open={invitationPin != null} onClose={onInvitationCancel}>
                <DialogTitle>{strings('/workspaces/invite-title')}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item className={classes.invitationSection} xl={6} lg={6} md={6} sm={12} xs={12}>
                            <Typography className={classes.invitationSectionTitle}>
                                {strings('/workspaces/invite-code-enter')}
                            </Typography>
                            <Typography>{invitationPin}</Typography>
                        </Grid>
                        <Grid item className={classes.invitationSection} xl={6} lg={6} md={6} sm={12} xs={12}>
                            <Typography className={classes.invitationSectionTitle}>
                                {strings('/workspaces/invite-code-scan')}
                            </Typography>
                            <QRCode value={invitationPin ?? ''} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={onInvitationCancel}
                    >
                        {strings('/base/close')}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={focusedMember != null} onClose={onMemberEditCancel}>
               <DialogTitle>
                   {strings('/workspaces/edit-roles', focusedMember?.firstName, focusedMember?.lastName)}
               </DialogTitle>
               <DialogContent>
                   <Grid container spacing={5}>
                       <Grid className={classes.invitationSection} item xl={6} lg={6} md={12} sm={12} xs={12}>
                            {focusedMember && (
                                <ProfilePicture
                                    variant="large"
                                    user={focusedMember}
                                />
                            )}
                       </Grid>
                       <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                            <MemberRolesForm
                                strings={strings}
                                formik={memberRolesFormik}
                            />
                       </Grid>
                   </Grid>
               </DialogContent>
               <DialogActions>
                    <Button
                       variant="outlined"
                       onClick={onMemberEditCancel}
                       color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                       variant="contained"
                       onClick={memberRolesFormik.submitForm}
                       color="primary"
                    >
                        Save
                    </Button>
               </DialogActions>
            </Dialog>
            <Dialog open={memberToRemove != null} onClose={onMemberRemoveCancel}>
                <DialogTitle>
                    {strings('/workspaces/member-delete-confirm', memberToRemove?.firstName, memberToRemove?.lastName)}
                </DialogTitle>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={onMemberRemoveCancel}
                    >
                        {strings('/base/no')}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onMemberRemoveConfirm}
                    >
                        {strings('/base/yes')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Page>
    );
}

WorkspaceDetailsPage.defaultProps = {
    members: [],
    strings: (name: string, ...args: any[]) => '',
    loaded: false,
    onInvite: () => {},
    invitationPin: null,
    onInvitationCancel: () => {},
    memberRolesFormik: {},
    onMemberEdit: () => {},
    onMemberEditCancel: () => {},
    memberToRemove: null,
    onMemberToRemoveSelect: (member: Member) => {},
    onMemberRemoveCancel: () => {},
    onMemberRemoveConfirm: () => {},
    editMode: false,
    onEnterEditMode: () => {},
    onQuitEditMode: () => {},
    workspaceEditFormik: {}
}

export default WorkspaceDetailsPage;