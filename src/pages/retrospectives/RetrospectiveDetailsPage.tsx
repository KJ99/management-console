import { Add, Delete, Download, Edit, FileUpload, Remove, Upload } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Link, Breadcrumbs, Typography, Card, CardContent, Grid, Button, CardActions, Dialog, DialogContent, DialogTitle, DialogActions, CardHeader } from "@mui/material";
import clsx from "clsx";
import { FormikProps } from "formik";
import moment from "moment";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { v4 } from "uuid";
import ConditionalView from "../../components/ConditionalView";
import RetrospectiveForm, { RetrospectiveFormModel } from "../../components/forms/RetrospectiveForm";
import RetrospectiveUpdateForm from "../../components/forms/RetrospectiveUpdateForm";
import ListView from "../../components/ListView";
import Page from "../../components/Page";
import RestrictedView from "../../components/RestrictedView";
import RetroStatus from "../../extension/RetroStatus";
import WorkspaceRole from "../../extension/WorkspaceRole";
import Member from "../../models/member/Member";
import ActionItem from "../../models/retrospective/ActionItem";
import Retrospective from "../../models/retrospective/Retrospective";
import Team from "../../models/team/Team";
import panelDashboard from '../../resources/styles/layouts/WorkspaceDashboard';
import styleSheet from "../../resources/styles/pages/retrospectives/RetrospectiveDetailsPage";
import paths from '../../routings/paths.json';
import { preparePath } from "../../utils/PathUtil";
import { prepareActionItemSubtitle } from "../../utils/RetroUtil";

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    workspace?: Team,
    loaded: boolean,
    retrospective?: Retrospective,
    items: ActionItem[],
    retrospectiveUpdateFormik: FormikProps<RetrospectiveFormModel>,
    editMode: boolean,
    onEnterEditMode: () => void,
    onQuitEditMode: () => void,
    deleteMode: boolean,
    onEnterDeleteMode: () => void,
    onQuitDeleteMode: () => void,
    onDeleteConfirm: () => void,
    deleting: boolean,
    teamMembers: Member[]
};

const RetrospectiveDetailsPage = ({
    strings, 
    workspace ,
    loaded,
    retrospective,
    items,
    retrospectiveUpdateFormik: retrospectiveUpdateFormik,
    editMode,
    onEnterEditMode,
    onQuitEditMode,
    deleteMode,
    onEnterDeleteMode,
    onQuitDeleteMode,
    onDeleteConfirm,
    deleting,
    teamMembers
}: Props) => {
    const panelClasses = panelDashboard();
    const classes = styleSheet();
    return (
        <Page title={strings('/retro/details-title')}>
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
                        <Link 
                            className={panelClasses.breadcrumbsItem} 
                            component={NavLink} 
                            to={
                                preparePath(
                                    paths.app.workspaces.details.path, 
                                    { 
                                        workspaceId: workspace?.id
                                    }
                                )
                            }
                        >
                            {workspace?.name}
                        </Link>
                        <Link 
                            className={panelClasses.breadcrumbsItem} 
                            component={NavLink} 
                            to={
                                preparePath(
                                    paths.app.workspaces.retro.index.path,
                                    { 
                                        workspaceId: workspace?.id
                                    }
                                )
                            }
                        >
                            {strings('/retro/breadcrumbs/index')}
                        </Link>
                        <Typography className={panelClasses.currentBreadcrumbsItem}>
                            {retrospective?.title}
                        </Typography>
                    </Breadcrumbs>
                    <Typography className={panelClasses.pageTitle}>
                        {strings('/retro/details-title')}
                    </Typography>
                </Box>
                <Box className={panelClasses.pageActionsArea}>
                    <RestrictedView
                        permittedRoles={[WorkspaceRole.SCRUM_MASTER, WorkspaceRole.PRODUCT_OWNER]}
                    > 
                        <ConditionalView condition={retrospective?.hasStatus(RetroStatus.FINISHED)}>
                            <Button
                                variant="contained"
                                startIcon={<Download />}
                                color="primary"
                                className={panelClasses.pageAction}
                            >
                                {strings('/retro/export')}
                            </Button>
                        </ConditionalView>
                    </RestrictedView>
                    <RestrictedView
                        permittedRoles={[WorkspaceRole.SCRUM_MASTER]}
                    >
                        <ConditionalView condition={retrospective?.hasStatus(RetroStatus.SCHEDULED)}>
                            <LoadingButton
                                loading={deleting}
                                variant="contained"
                                startIcon={<Delete />}
                                color="error"
                                className={panelClasses.pageAction}
                                onClick={onEnterDeleteMode}
                            >
                                {strings('/retro/delete')}
                            </LoadingButton>
                        </ConditionalView>
                    </RestrictedView>
                </Box>
            </Box>
            <Card>
                <CardHeader
                    title={strings('/retro/general-info')}
                    action={ 
                        <RestrictedView permittedRoles={[WorkspaceRole.SCRUM_MASTER]}>
                            <ConditionalView condition={retrospective?.hasStatus(RetroStatus.SCHEDULED)}>
                                <ConditionalView
                                    condition={!editMode}
                                    otherwise={
                                        <Fragment>
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
                                                        onClick={retrospectiveUpdateFormik.submitForm}
                                                        loading={retrospectiveUpdateFormik.isSubmitting}
                                                    >
                                                        {strings('/base/save')}
                                                    </LoadingButton>
                                                </Grid>
                                            </Grid>
                                        </Fragment>
                                    }
                                >
                                    <Button
                                        variant="contained"
                                        startIcon={<Edit />}
                                        onClick={onEnterEditMode}
                                    >
                                        {strings('/base/edit')}
                                    </Button>
                                </ConditionalView>
                            </ConditionalView>
                        </RestrictedView>
                    }
                />
                <CardContent className={clsx({
                    [classes.retrospectiveCardContentEditMode]: editMode
                })}>
                    <ConditionalView
                        condition={!editMode}
                        otherwise={
                            <RetrospectiveUpdateForm
                                formik={retrospectiveUpdateFormik}
                                strings={strings}
                                hideSave
                            />
                        }
                    >
                        <>
                            <Typography className={classes.plannigTitle}>{retrospective?.title}</Typography>
                            {retrospective?.startDate != null && (
                                <Typography className={classes.retrospectiveSubtitle}>
                                    {moment(retrospective.startDate).format('LLLL')}
                                </Typography>
                            )}
                        </>
                    </ConditionalView>
                </CardContent>
            </Card>
            <Box className={classes.itemsHeader}>
                <Typography className={classes.itemsLabel}>
                    {strings('/retro/action-items')}
                </Typography>
            </Box>
            <ListView
                hideAction
                data={items}
                getRowTitle={(item) => item.title}
                getRowSubtitle={(item) => prepareActionItemSubtitle(item, teamMembers, strings)}
                isItemCrossedOut={(item) => item.completed}
            />
            <Dialog open={deleteMode} onClose={onQuitDeleteMode}>
                <DialogTitle>
                    {strings('/retro/delete-confirm', retrospective?.title)}
                </DialogTitle>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={onQuitDeleteMode}
                    >
                        {strings('/base/no')}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onDeleteConfirm}
                    >
                        {strings('/base/yes')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Page>
    );
};

RetrospectiveDetailsPage.defaultProps = {
    strings: (name: any, ...args: any[]) => '',
    loaded: false,
    items: [],
    retrospectiveUpdateFormik: {},
    editMode: false,
    onEnterEditMode: () => {},
    onQuitEditMode: () => {},
    deleteMode: false,
    onEnterDeleteMode: () => {},
    onQuitDeleteMode: () => {},
    onDeleteConfirm: () => {},
    deleting: false,
    teamMembers: []
}

export default RetrospectiveDetailsPage;
