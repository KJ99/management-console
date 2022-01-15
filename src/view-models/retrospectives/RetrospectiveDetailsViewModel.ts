import { Children, cloneElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { StringsContext } from "../../contexts/StringsContext";
import { ViewModelProps } from "../ViewModelProps";
import { WorkspaceContext } from "../../contexts/WorkspaceContext";
import { useNavigate, useParams } from "react-router";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from 'yup';
import moment from "moment";
import { mapper } from "../../utils/Mapper";
import BadRequestError from "../../infrastructure/api/exceptions/BadRequestError";
import { processFormError } from "../../utils/ErrorProcessor";
import * as PathUtil from '../../utils/PathUtil';
import paths from '../../routings/paths.json';
import RetrospectivesClient from "../../infrastructure/clients/retro-helper/RetrospectivesClient";
import ActionItemsClient from "../../infrastructure/clients/retro-helper/ActionItemsClient";
import Retrospective from "../../models/retrospective/Retrospective";
import ActionItem from "../../models/retrospective/ActionItem";
import { RetrospectiveUpdateFormModel } from "../../components/forms/RetrospectiveUpdateForm";
import RetrospectiveUpdateModel from "../../models/retrospective/RetrospectiveUpdateModel";
import RetroDesign from "../../extension/RetroDesign";
import Member from "../../models/member/Member";
import MembersClient from "../../infrastructure/clients/teams-api/MembersClient";

const client = new RetrospectivesClient();
const itemsClient = new ActionItemsClient();
const membersClient = new MembersClient();

const RetrospectiveDetailsViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const [loaded, setLoaded] = useState(false);
    const { retroId } = useParams();
    const { workspace } = useContext(WorkspaceContext);
    const { enqueueSnackbar } = useSnackbar();
    const [retrospective, setRetro] = useState<Retrospective|undefined>();
    const [items, setItems] = useState<ActionItem[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const navigate = useNavigate();
    const [teamMembers, setTeamMembers] = useState<Member[]>([]);

    useEffect(() => {
        if (workspace?.id != null) {
            membersClient.getTeamMembers(workspace.id)
                .then((members) => setTeamMembers(members))
                .catch(() => console.warn('Could not load team members'));
        }
    }, [workspace]);

    const loadItems = useCallback((retroId: number) => {
        itemsClient.getActionItems({ retroId })
            .then((items) => setItems(items))
            .catch(() => enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' }))

    }, []);

    const loadRetrospective = useCallback((id) => {
        client.get(id)
            .then((retro) => setRetro(retro))
            .catch(() => enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' }))
            .finally(() => setLoaded(true));
    }, [enqueueSnackbar, strings])

    useEffect(() => {
        const id: number = parseInt(retroId ?? '-1');
        loadItems(id);
        loadRetrospective(id);

    }, [retroId, loadItems, loadRetrospective]);

    const handleRetrospectiveUpdate = useCallback(
        (values: RetrospectiveUpdateFormModel, helpers: FormikHelpers<RetrospectiveUpdateFormModel>) => {
            if (retrospective == null) {
                return;
            }
            const model = mapper.map(values, RetrospectiveUpdateModel, RetrospectiveUpdateFormModel);
            client.updateRetro(retrospective, model)
                .then(() => {
                    enqueueSnackbar(strings('/retro/update-success'), { variant: 'success' });
                    setEditMode(false);
                    loadRetrospective(retrospective.id!);
                })
                .catch((e) => {
                    if (e instanceof BadRequestError) {
                        helpers.setErrors(processFormError(e.errors));
                    } else {
                        enqueueSnackbar(strings('/retro/update-fail'), { variant: 'error' })
                    }
                })
                .finally(() => helpers.setSubmitting(false));
        }, 
        [retrospective, enqueueSnackbar, strings]
    );

    const retrospectiveUpdateFormik = useFormik<RetrospectiveUpdateFormModel>({
        initialValues: {
            title: '',
            startDate: moment(),
            config: {
                design: RetroDesign[RetroDesign.DEFAULT],
                votes: 1,
                answerTime: 5,
                votingTime: 5
            }
        },
        onSubmit: handleRetrospectiveUpdate,
        validationSchema: Yup.object({
            title: Yup.string().test({
                name: 'non-empty',
                message: '/errors/non-empty',
                test: (val) => typeof val == 'string' && val.trim().length > 0
            }),
            config: Yup.object({
                votes: Yup.number()
                    .positive('/errors/positive-number')
                    .typeError('/errors/positive-number'),
                answerTime: Yup.number()
                    .positive('/errors/positive-number')
                    .typeError('/errors/positive-number'),
                votingTime: Yup.number()
                    .positive('/errors/positive-number')
                    .typeError('/errors/positive-number'),
            })
        })
    });

    useEffect(() => {
        retrospectiveUpdateFormik.setValues(
            mapper.map(retrospective, RetrospectiveUpdateFormModel, Retrospective)
        );
    }, [retrospective, retrospectiveUpdateFormik.setValues]);

    const handleEnterEditMode = useCallback(() => setEditMode(true), []);
    const handleQuitEditMode = useCallback(() => {
        setEditMode(false);
        retrospectiveUpdateFormik.setValues(
            mapper.map(retrospective, RetrospectiveUpdateFormModel, Retrospective)
        );
    }, [retrospective, retrospectiveUpdateFormik.setValues]);

    const handleEnterDeleteMode = useCallback(() => setDeleteMode(true), []);
    const handleQuitDeleteMode = useCallback(() => setDeleteMode(false), []);
    const handleDelete = useCallback(
        () => {
            if (retrospective?.id != null) {
                setDeleting(true);
                client.deleteRetro(retrospective.id)
                    .then(() => {
                        enqueueSnackbar(strings('/retro/delete-success'), { variant: 'success' });
                        navigate(
                            PathUtil.preparePath(
                                paths.app.workspaces.retro.index.path,
                                { workspaceId: workspace?.id }
                            )
                        );
                    }) 
                    .catch(
                        () => 
                            enqueueSnackbar(strings('/retro/delete-success'), { variant: 'error' })
                    )
                    .finally(() => setDeleting(false));
            }
        },
        [workspace, retrospective, enqueueSnackbar, strings, navigate]
    );

    return Children.only(
        cloneElement(
            children,
            {
                strings,
                loaded,
                workspace,
                retrospective,
                items,
                retrospectiveUpdateFormik,
                editMode,
                onEnterEditMode: handleEnterEditMode,
                onQuitEditMode: handleQuitEditMode,
                deleteMode,
                onEnterDeleteMode: handleEnterDeleteMode,
                onQuitDeleteMode: handleQuitDeleteMode,
                onDeleteConfirm: handleDelete,
                deleting,
                teamMembers
            }
        )
    );
}

export default RetrospectiveDetailsViewModel;