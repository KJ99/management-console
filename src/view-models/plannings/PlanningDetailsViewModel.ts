import { Children, cloneElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { StringsContext } from "../../contexts/StringsContext";
import { ViewModelProps } from "../ViewModelProps";
import { WorkspaceContext } from "../../contexts/WorkspaceContext";
import ReportsClient from "../../infrastructure/clients/daily-helper/ReportsClient";
import { DefaultPageSize } from "../../utils/Environment";
import Planning from "../../models/planning/Planning";
import PlanningsClient from "../../infrastructure/clients/planning-poker/PlanningsClient";
import PlanningStatus from "../../extension/PlanningStatus";
import PlanningItem from "../../models/planning/PlanningItem";
import { useNavigate, useParams } from "react-router";
import PlanningItemsClient from "../../infrastructure/clients/planning-poker/PlanningItemsClient";
import PlanningItemModel from "../../models/planning/PlanningItemModel";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from 'yup';
import PlanningItemUpdateModel from "../../models/planning/PlanningItemUpdateModel";
import PlanningUpdateModel from "../../models/planning/PlanningUpdateModel";
import moment from "moment";
import PlanningForm, { PlanningFormModel } from "../../components/forms/PlanningForm";
import { mapper } from "../../utils/Mapper";
import BadRequestError from "../../infrastructure/api/exceptions/BadRequestError";
import { processFormError } from "../../utils/ErrorProcessor";
import * as PathUtil from '../../utils/PathUtil';
import paths from '../../routings/paths.json';

const client = new PlanningsClient();
const itemsClient = new PlanningItemsClient();

const PlanningDetailsViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const [loaded, setLoaded] = useState(false);
    const { planningId } = useParams();
    const { workspace } = useContext(WorkspaceContext);
    const { enqueueSnackbar } = useSnackbar();
    const [planning, setPlanning] = useState<Planning|undefined>();
    const [items, setItems] = useState<PlanningItem[]>([]);
    const [editingItem, setEditingItem] = useState<PlanningItem|undefined>();
    const [createItemDialogOpen, setCreateItemDialogOpen] = useState<boolean>(false);
    const [itemToRemove, setItemToRemove] = useState<PlanningItem|undefined>();
    const [importing, setImporting] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const navigate = useNavigate();

    const loadItems = useCallback((planningId: number) => {
        itemsClient.getItems(planningId)
            .then((items) => setItems(items))
            .catch(() => enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' }))

    }, []);

    const loadPlanning = useCallback((id) => {
        client.getPlanning(id)
            .then((planning) => setPlanning(planning))
            .catch(() => enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' }))
            .finally(() => setLoaded(true));
    }, [enqueueSnackbar, strings])

    useEffect(() => {
        const id: number = parseInt(planningId ?? '-1');
        loadItems(id);
        loadPlanning(id);

    }, [planningId, loadItems, loadPlanning]);

    const handleItemCreate = useCallback(
        (model: PlanningItemModel, helpers: FormikHelpers<PlanningItemModel>) => {
            model.planningId = parseInt(planningId ?? '-1');
            itemsClient.createItem(model)
                .then(() => {
                    enqueueSnackbar(strings('/plannings/item-create-success'), { variant: 'success' })
                    loadItems(model.planningId!);
                })
                .catch((e) => {
                    if (e instanceof BadRequestError) {
                        helpers.setErrors(processFormError(e.errors));
                    } else {
                        enqueueSnackbar(strings('/plannings/item-create-fail'), { variant: 'error' })
                    }
                })
                .finally(() => {
                    helpers.setSubmitting(false);
                    setCreateItemDialogOpen(false);
                });
        }, 
        [planningId, enqueueSnackbar, strings]
    );

    const handleItemUpdate = useCallback(
        (model: PlanningItemUpdateModel, helpers: FormikHelpers<PlanningItemUpdateModel>) => {
            if (editingItem == null) {
                return;
            }

            const id = parseInt(planningId ?? '-1');
            itemsClient.updateItem(id, editingItem, model)
                .then(() => {
                    enqueueSnackbar(strings('/plannings/item-update-success'), { variant: 'success' })
                    loadItems(id);
                })
                .catch((e) => {
                    if (e instanceof BadRequestError) {
                        helpers.setErrors(processFormError(e.errors));
                    } else {
                        enqueueSnackbar(strings('/plannings/item-update-fail'), { variant: 'error' })
                    }
                })
                .finally(() => {
                    helpers.setSubmitting(false);
                    setEditingItem(undefined);
                });
        }, 
        [editingItem, planningId, enqueueSnackbar, strings]
    );

    const handlePlanningUpdate = useCallback(
        (values: PlanningFormModel, helpers: FormikHelpers<PlanningFormModel>) => {
            if (planning == null) {
                return;
            }
            const model = mapper.map(values, PlanningUpdateModel, PlanningFormModel);
            client.updatePlanning(planning, model)
                .then(() => {
                    enqueueSnackbar(strings('/plannings/update-success'), { variant: 'success' });
                    setEditMode(false);
                    loadPlanning(planning.id!);
                })
                .catch((e) => {
                    if (e instanceof BadRequestError) {
                        helpers.setErrors(processFormError(e.errors));
                    } else {
                        enqueueSnackbar(strings('/plannings/update-fail'), { variant: 'error' })
                    }
                })
                .finally(() => helpers.setSubmitting(false));
        }, 
        [planning, enqueueSnackbar, strings]
    );

    const handleDeleteItem = useCallback(
        async () => {
            const pid = parseInt(planningId ?? '-1');
            try {
                await itemsClient.deleteItem(pid, itemToRemove?.id ?? -1);
                enqueueSnackbar(strings('/plannings/item-delete-success'), { variant: 'success' });
                loadItems(pid);
            } catch (e) {
                enqueueSnackbar(strings('/plannings/item-delete-fail'), { variant: 'error' });
            } finally {
                setItemToRemove(undefined);
            }
        }, 
        [itemToRemove, enqueueSnackbar, strings, loadItems, planningId]
    );

    const handleSelectItemToRemove = useCallback((item: PlanningItem) => setItemToRemove(item), []);
    const handleCancelItemRemove= useCallback(() => setItemToRemove(undefined), []);

    const itemCreateFormik = useFormik<PlanningItemModel>({
        initialValues: {
            title: '',
            description: ''
        },
        onSubmit: handleItemCreate,
        validationSchema: Yup.object({
            title: Yup.string().test({
                name: 'non-empty',
                message: '/errors/non-empty',
                test: (val) => typeof val == 'string' && val.trim().length > 0
            })
        })
    });

    const itemUpdateFormik = useFormik<PlanningItemUpdateModel>({
        initialValues: {
            title: '',
            description: ''
        },
        onSubmit: handleItemUpdate,
        validationSchema: Yup.object({
            title: Yup.string().test({
                name: 'non-empty',
                message: '/errors/non-empty',
                test: (val) => typeof val == 'string' && val.trim().length > 0
            })
        })
    });

    const planningUpdateFormik = useFormik<PlanningFormModel>({
        initialValues: {
            title: '',
            startDate: moment()
        },
        onSubmit: handlePlanningUpdate,
        validationSchema: Yup.object({
            title: Yup.string().test({
                name: 'non-empty',
                message: '/errors/non-empty',
                test: (val) => typeof val == 'string' && val.trim().length > 0
            })
        })
    });

    useEffect(() => {
        planningUpdateFormik.setValues(
            mapper.map(planning, PlanningFormModel, Planning)
        );
    }, [planning, planningUpdateFormik.setValues]);

    useEffect(() => {
        if (editingItem != null) {
            itemUpdateFormik.setValues(
                mapper.map(editingItem, PlanningItemUpdateModel, PlanningItem)
            );
        } else {
            itemUpdateFormik.resetForm();
        }
    }, [editingItem, itemUpdateFormik.setValues, itemUpdateFormik.resetForm]);

    const handleOpenCreateItemDialog = useCallback(() => setCreateItemDialogOpen(true), []);
    
    const handleCloseCreateItemDialog = useCallback(() => {
        setCreateItemDialogOpen(false);
        itemCreateFormik.resetForm();
    }, [itemCreateFormik.resetForm]);

    const handleSelectEditingItem = useCallback(
        (item: PlanningItem) => setEditingItem(item), 
        []
    );

    const handleCancelItemEdit = useCallback(() => setEditingItem(undefined), []);

    const handleImportItems = useCallback((file: File) => {
        const pid = parseInt(planningId ?? '-1');
        setImporting(true);
        itemsClient.importItems({ file, planningId: pid })
            .then(() => {
                enqueueSnackbar(strings('/plannings/import-items-success'), { variant: 'success' })
                loadItems(pid);
            })
            .catch(() => enqueueSnackbar(strings('/plannings/import-items-fail'), { variant: 'error' }))
            .finally(() => setImporting(false))

    }, [planningId, loadItems, enqueueSnackbar, strings]);

    const handleEnterEditMode = useCallback(() => setEditMode(true), []);
    const handleQuitEditMode = useCallback(() => {
        setEditMode(false);
        planningUpdateFormik.setValues(mapper.map(planning, PlanningFormModel, Planning));
    }, [planning, planningUpdateFormik.setValues]);

    const handleEnterDeleteMode = useCallback(() => setDeleteMode(true), []);
    const handleQuitDeleteMode = useCallback(() => setDeleteMode(false), []);
    const handleDelete = useCallback(
        () => {
            if (planning?.id != null) {
                setDeleting(true);
                client.deletePlanning(planning.id)
                    .then(() => {
                        enqueueSnackbar(strings('/plannings/delete-success'), { variant: 'success' });
                        navigate(
                            PathUtil.preparePath(
                                paths.app.workspaces.planning.index.path,
                                { workspaceId: workspace?.id }
                            )
                        );
                    }) 
                    .catch(
                        () => 
                            enqueueSnackbar(strings('/plannings/delete-success'), { variant: 'error' })
                    )
                    .finally(() => setDeleting(false));
            }
        },
        [workspace, planning, enqueueSnackbar, strings, navigate]
    );

    return Children.only(
        cloneElement(
            children,
            {
                strings,
                loaded,
                workspace,
                planning,
                items,
                onCreateItem: handleOpenCreateItemDialog,
                onCancelCreateItem: handleCloseCreateItemDialog,
                onEditItem: handleSelectEditingItem,
                onCancelEditItem: handleCancelItemEdit,
                itemCreateFormik,
                itemUpdateFormik,
                planningUpdateFormik,
                editingItem,
                createItemDialogOpen,
                itemToRemove,
                onDeleteItem: handleSelectItemToRemove,
                onCancelDeleteItem: handleCancelItemRemove,
                onConfirmDeleteItem: handleDeleteItem,
                onImportItems: handleImportItems,
                itemsImporting: importing,
                editMode,
                onEnterEditMode: handleEnterEditMode,
                onQuitEditMode: handleQuitEditMode,
                deleteMode,
                onEnterDeleteMode: handleEnterDeleteMode,
                onQuitDeleteMode: handleQuitDeleteMode,
                onDeleteConfirm: handleDelete,
                deleting
            }
        )
    );
}

export default PlanningDetailsViewModel;