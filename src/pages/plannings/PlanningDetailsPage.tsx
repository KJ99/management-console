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
import PlanningForm, { PlanningFormModel } from "../../components/forms/PlanningForm";
import PlanningItemForm from "../../components/forms/PlanningItemForm";
import Page from "../../components/Page";
import RestrictedView from "../../components/RestrictedView";
import PlanningStatus from "../../extension/PlanningStatus";
import WorkspaceRole from "../../extension/WorkspaceRole";
import Planning from "../../models/planning/Planning";
import PlanningItem from "../../models/planning/PlanningItem";
import PlanningItemModel from "../../models/planning/PlanningItemModel";
import PlanningItemUpdateModel from "../../models/planning/PlanningItemUpdateModel";
import Team from "../../models/team/Team";
import panelDashboard from '../../resources/styles/layouts/WorkspaceDashboard';
import styleSheet from "../../resources/styles/pages/plannings/PlanningDetailsPage";
import paths from '../../routings/paths.json';
import { preparePath } from "../../utils/PathUtil";

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    workspace?: Team,
    loaded: boolean,
    planning?: Planning,
    items: PlanningItem[],
    onCreateItem: () => void,
    onCancelCreateItem: () => void,
    onEditItem: (item: PlanningItem) => void,
    onCancelEditItem: () => void,
    itemCreateFormik: FormikProps<PlanningItemModel>,
    itemUpdateFormik: FormikProps<PlanningItemUpdateModel>,
    planningUpdateFormik: FormikProps<PlanningFormModel>,
    editingItem?: PlanningItem
    createItemDialogOpen: boolean,
    itemToRemove?: PlanningItem,
    onDeleteItem: (item: PlanningItem) => void,
    onCancelDeleteItem: () => void,
    onConfirmDeleteItem: () => void,
    onImportItems: (file: File) => void,
    itemsImporting: boolean,
    editMode: boolean,
    onEnterEditMode: () => void,
    onQuitEditMode: () => void,
    deleteMode: boolean,
    onEnterDeleteMode: () => void,
    onQuitDeleteMode: () => void,
    onDeleteConfirm: () => void,
    deleting: boolean,
    onReportDownload: () => void
};

const PlanningDetailsPage = ({
    strings, 
    workspace ,
    loaded,
    planning,
    items,
    onCreateItem,
    onCancelCreateItem,
    onEditItem,
    onCancelEditItem,
    itemCreateFormik,
    itemUpdateFormik,
    planningUpdateFormik,
    editingItem,
    createItemDialogOpen,
    itemToRemove,
    onDeleteItem,
    onCancelDeleteItem,
    onConfirmDeleteItem,
    onImportItems,
    itemsImporting,
    editMode,
    onEnterEditMode,
    onQuitEditMode,
    deleteMode,
    onEnterDeleteMode,
    onQuitDeleteMode,
    onDeleteConfirm,
    deleting,
    onReportDownload
}: Props) => {
    const panelClasses = panelDashboard();
    const classes = styleSheet();
    return (
        <Page title={strings('/plannings/details-title')}>
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
                                    paths.app.workspaces.planning.index.path,
                                    { 
                                        workspaceId: workspace?.id
                                    }
                                )
                            }
                        >
                            {strings('/plannings/breadcrumbs/index')}
                        </Link>
                        <Typography className={panelClasses.currentBreadcrumbsItem}>
                            {planning?.title}
                        </Typography>
                    </Breadcrumbs>
                    <Typography className={panelClasses.pageTitle}>
                        {strings('/plannings/details-title')}
                    </Typography>
                </Box>
                <Box className={panelClasses.pageActionsArea}>
                    <RestrictedView
                        permittedRoles={[WorkspaceRole.SCRUM_MASTER, WorkspaceRole.PRODUCT_OWNER]}
                    > 
                        <ConditionalView condition={planning?.hasStatus(PlanningStatus.FINISHED)}>
                            <Button
                                variant="contained"
                                startIcon={<Download />}
                                color="primary"
                                className={panelClasses.pageAction}
                                onClick={onReportDownload}
                            >
                                {strings('/plannings/export')}
                            </Button>
                        </ConditionalView>
                    </RestrictedView>
                    <RestrictedView
                        permittedRoles={[WorkspaceRole.SCRUM_MASTER]}
                    >
                        <ConditionalView condition={planning?.hasStatus(PlanningStatus.SCHEDULED)}>
                            <LoadingButton
                                loading={deleting}
                                variant="contained"
                                startIcon={<Delete />}
                                color="error"
                                className={panelClasses.pageAction}
                                onClick={onEnterDeleteMode}
                            >
                                {strings('/plannings/delete')}
                            </LoadingButton>
                        </ConditionalView>
                    </RestrictedView>
                </Box>
            </Box>
            <Card>
                <CardHeader
                    title={strings('/plannings/general-info')}
                    action={ 
                        <RestrictedView permittedRoles={[WorkspaceRole.SCRUM_MASTER]}>
                            <ConditionalView condition={planning?.hasStatus(PlanningStatus.SCHEDULED)}>
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
                                                        onClick={planningUpdateFormik.submitForm}
                                                        loading={planningUpdateFormik.isSubmitting}
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
                    [classes.planningCardContentEditMode]: editMode
                })}>
                    <ConditionalView
                        condition={!editMode}
                        otherwise={
                            <PlanningForm
                                formik={planningUpdateFormik}
                                strings={strings}
                                hideSave
                            />
                        }
                    >
                        <>
                            <Typography className={classes.plannigTitle}>{planning?.title}</Typography>
                            {planning?.startDate != null && (
                                <Typography className={classes.planningSubtitle}>
                                    {moment(planning.startDate).format('LLLL')}
                                </Typography>
                            )}
                        </>
                    </ConditionalView>
                </CardContent>
            </Card>
            <Box className={classes.itemsHeader}>
                <Typography className={classes.itemsLabel}>
                    {strings('/plannings/items-label')}
                </Typography>
                <RestrictedView permittedRoles={[WorkspaceRole.PRODUCT_OWNER]}>
                    <ConditionalView condition={planning?.hasStatus(PlanningStatus.SCHEDULED)}>
                        <Box>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={onCreateItem}
                            >
                                {strings('/base/create')}
                            </Button>
                            <input
                                accept="text/csv"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                multiple
                                type="file"
                                onChange={(evt) => {
                                    const files = evt.target.files ?? [];
                                    if (files.length > 0) {
                                        onImportItems(files[0]);
                                    }
                                }}
                            />
                            <label htmlFor="raised-button-file">
                                <LoadingButton 
                                    loading={itemsImporting}
                                    variant="outlined"
                                    component="span"
                                    startIcon={<Upload />}
                                    className={classes.importButton}
                                >
                                    {strings('/plannings/import-items')}
                                </LoadingButton>
                            </label> 
                        </Box>
                    </ConditionalView>
                </RestrictedView>
            </Box>
            <Grid container direction="column" spacing={3}>
                {items.map((item) => {
                    const contentColumnSize = item.estimation != null ? 5 : 6;
                    return (
                        <Grid item key={v4()}>
                            <Card className={classes.itemCard}>
                                <CardContent className={classes.itemCardContent}>
                                    <Grid container spacing={3} alignItems="center">
                                        <Grid item md={contentColumnSize} xs={12}>
                                            <Typography 
                                                className={classes.itemTitle}
                                            >
                                                {item.title}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={contentColumnSize} xs={12}>
                                            <Typography>{item.description}</Typography>
                                        </Grid>
                                        <ConditionalView condition={item.estimation != null}>
                                            <Grid item md={2} xs={12}>
                                                <Typography>
                                                    Story points: {item.estimation}
                                                </Typography>
                                            </Grid>
                                        </ConditionalView>
                                    </Grid>
                                </CardContent>
                                <RestrictedView permittedRoles={[WorkspaceRole.PRODUCT_OWNER]}>
                                    <ConditionalView condition={planning?.hasStatus(PlanningStatus.SCHEDULED)}>
                                        <CardActions className={classes.itemActionsContainer}>
                                            <Button
                                                variant="contained"
                                                startIcon={<Edit />}
                                                className={classes.itemAction}
                                                onClick={() => onEditItem(item)}
                                            >
                                                {strings('/base/edit')}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={<Delete />}
                                                className={classes.itemAction}
                                                onClick={() => onDeleteItem(item)}
                                            >
                                                {strings('/base/delete')}
                                            </Button>
                                        </CardActions>
                                    </ConditionalView>
                                </RestrictedView>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
            <Dialog open={createItemDialogOpen} onClose={onCancelCreateItem}>
                <DialogTitle>
                    {strings('/plannings/create-item')}
                </DialogTitle>
                <DialogContent>
                    <Box mt={3}>
                        <PlanningItemForm
                            strings={strings}
                            formik={itemCreateFormik}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={onCancelCreateItem}
                    >
                        {strings('/base/cancel')}
                    </Button>
                    <LoadingButton
                        variant="contained"
                        onClick={itemCreateFormik.submitForm}
                        loading={itemCreateFormik.isSubmitting}
                    >
                        {strings('/base/save')}
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <Dialog open={editingItem != null} onClose={onCancelEditItem}>
                <DialogTitle>
                    {strings('/plannings/edit-item', editingItem?.title)}
                </DialogTitle>
                <DialogContent>
                    <Box mt={3}>
                        <PlanningItemForm
                            strings={strings}
                            formik={itemUpdateFormik}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={onCancelEditItem}
                    >
                        {strings('/base/cancel')}
                    </Button>
                    <LoadingButton
                        variant="contained"
                        onClick={itemUpdateFormik.submitForm}
                        loading={itemUpdateFormik.isSubmitting}
                    >
                        {strings('/base/save')}
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <Dialog open={itemToRemove != null} onClose={onCancelDeleteItem}>
                <DialogTitle>
                    {strings('/plannings/item-delete-confirm', itemToRemove?.title)}
                </DialogTitle>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={onCancelDeleteItem}
                    >
                        {strings('/base/no')}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onConfirmDeleteItem}
                    >
                        {strings('/base/yes')}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteMode} onClose={onQuitDeleteMode}>
                <DialogTitle>
                    {strings('/plannings/delete-confirm', planning?.title)}
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

PlanningDetailsPage.defaultProps = {
    strings: (name: any, ...args: any[]) => '',
    loaded: false,
    items: [],
    onCreateItem: () => {},
    onCancelCreateItem: () => {},
    onEditItem: (item: PlanningItem) => {},
    onCancelEditItem: () => {},
    itemCreateFormik: {},
    itemUpdateFormik: {},
    planningUpdateFormik: {},
    createItemDialogOpen: false,
    onDeleteItem: (item: PlanningItem) => {},
    onCancelDeleteItem: () => {},
    onConfirmDeleteItem: () => {},
    onImportItems: (file: File) => {},
    itemsImporting: false,
    editMode: false,
    onEnterEditMode: () => {},
    onQuitEditMode: () => {},
    deleteMode: false,
    onEnterDeleteMode: () => {},
    onQuitDeleteMode: () => {},
    onDeleteConfirm: () => {},
    deleting: false,
    onReportDownload: () => {}
}

export default PlanningDetailsPage;
