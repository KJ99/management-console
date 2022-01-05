import { FormikHelpers, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { Children, cloneElement, useCallback, useContext, useEffect, useState } from "react";
import { WorkspaceFormModel } from "../components/forms/WorkspaceForm";
import { StringsContext } from "../contexts/StringsContext";
import WorkspaceTheme from "../extension/WorkspaceTheme";
import useMounted from "../hooks/useMounted";
import TeamsClient from "../infrastructure/clients/teams-api/TeamsClient";
import Team from "../models/team/Team";
import TeamModel from "../models/team/TeamModel";
import { ViewModelProps } from "./ViewModelProps";
import * as Yup from 'yup';
import TeamsResourcesClient from "../infrastructure/clients/teams-api/TeamsResourcesClient";
import { mapper } from "../utils/Mapper";
import BadRequestError from "../infrastructure/api/exceptions/BadRequestError";
import { processFormError } from "../utils/ErrorProcessor";
import InvitationsClient from "../infrastructure/clients/teams-api/InvitationsClient";
import { InviteCodeFormModel } from "../components/forms/InviteCodeForm";
import ForbiddenError from "../infrastructure/api/exceptions/ForbiddenError";
import Invitation from "../models/invitations/Invitation";
import { DefaultPageSize } from "../utils/Environment";
import { SettingsContext } from "../contexts/SettingsContext";

const client = new TeamsClient();

const WorkspacesViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const { setWorkspaceTheme } = useContext(SettingsContext);
    const [loaded, setLoaded] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [workspaces, setWorkspaces] = useState<Team[]>([]);
    const [loadingError, setLoadingError] = useState(null); 
    const { enqueueSnackbar } = useSnackbar();
    const [page, setPage] = useState(0);
    const mounted = useMounted();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [codeDialogOpen, setCodeDialogOpen] = useState(false);
    const [invitation, setInvitation] = useState<Invitation|null>(null);
    const loadData = useCallback(
        (page: number, append: boolean = true) => {
            client.getUserTeams({ page, pageSize: DefaultPageSize })
                .then(teams => {
                    const data = teams.data ?? [];
                    setWorkspaces(prev => append ? [ ...prev, ...data ] : data);
                    setPage(teams.metadata?.page ?? 0)
                    setTotalPages(teams.metadata?.totalPages ?? 0);
                })
                .catch(e => setLoadingError(e))
                .finally(() => {
                    setLoaded(true);
                    setPageLoading(false);
                });
        },
        []
    );

    const reload = useCallback(() => {
        setLoaded(false);
        loadData(0, false);
    }, [loadData]);

    useEffect(() => {
        reload()
    }, [reload]);

    useEffect(() => {
        if (loadingError != null) { 
            enqueueSnackbar(strings('/errors/unknown', { variant: 'error' }));
        }
    }, [loadingError]);

    const handleCreateWorkspace = useCallback(
        async (values: WorkspaceFormModel, helpers: FormikHelpers<WorkspaceFormModel>) => {
            const model = mapper.map(values, TeamModel, WorkspaceFormModel);
            if (values.picture != null) {
                try {
                    const uploadClient = new TeamsResourcesClient();
                    const file = await uploadClient.upload({ file: values.picture });
                    model.pictureId = file.id
                } catch(e) {
                    enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' });
                    helpers.setSubmitting(false);
                    return;
                }
            }
            try {
                await client.createTeam(model);
                enqueueSnackbar(strings('/workspaces/created-success'), { variant: 'success' });
                helpers.resetForm();
                setCreateDialogOpen(false);
                reload();
            } catch (e) {
                if (e instanceof BadRequestError) {
                    helpers.setErrors(processFormError(e.errors));
                } else {
                    enqueueSnackbar(strings('/workspaces/created-fail', { variant: 'error' }));
                }
            } finally {
                helpers.setSubmitting(false);
            }
        },
        [enqueueSnackbar, strings, reload]
    );

    const createWorkspaceFormik = useFormik<WorkspaceFormModel>({
        initialValues: {
            name: '',
            theme: WorkspaceTheme[WorkspaceTheme.SEA],
            picture: undefined,
        },
        onSubmit: handleCreateWorkspace,
        validationSchema: Yup.object({
            name: Yup.string().test({
                name: 'non-empty',
                message: '/errors/non-empty',
                test: (val) => typeof val == 'string' && val.trim().length > 0
            })
        })
    });

    const handleSubmitInviteCode = useCallback(
        (values: InviteCodeFormModel, helpers: FormikHelpers<InviteCodeFormModel>) => {
            const invitationsClient = new InvitationsClient();
            invitationsClient.get(values.code.trim())
                .then(invitation => {
                    helpers.resetForm();
                    setInvitation(invitation);
                })
                .catch(e => {
                    if(e instanceof ForbiddenError) {
                        helpers.setErrors({ code: strings('/workspaces/invite-code-expired') });
                    } else {
                        enqueueSnackbar(strings('/workspaces/join-failed'), { variant: 'error' });
                    }
                })
                .finally(() => {
                    helpers.setSubmitting(false);
                })
        },
        [strings, enqueueSnackbar]
    );

    const inviteCodeFormik = useFormik<InviteCodeFormModel>({
        initialValues: {
            code: ''
        },
        onSubmit: handleSubmitInviteCode,
        validationSchema: Yup.object({
            code: Yup.string().test({
                name: 'non-empty',
                message: '/errors/non-empty',
                test: (val) => typeof val == 'string' && val.trim().length > 0
            })
        })
    });

    const handleJoinWorkspace = useCallback(() => {
        client.joinTeam({ inviteToken: invitation?.token })
            .then(() => {
                enqueueSnackbar(strings('/workspaces/join-success', invitation?.team?.name), { variant: 'success' });
                setCodeDialogOpen(false);
                setInvitation(null);
                reload();
            })
            .catch(() => enqueueSnackbar(strings('/workspaces/join-failed'), { variant: 'error' }));
    }, [invitation, enqueueSnackbar, strings, reload]);

    useEffect(() => {
        setWorkspaceTheme(WorkspaceTheme.SEA);
    }, [setWorkspaceTheme]);

    const handleCreateDialogClose = useCallback(() => setCreateDialogOpen(false), []);
    const handleCreateDialogOpen = useCallback(() => setCreateDialogOpen(true), []);
    const handleCodeDialogClose = useCallback(() => setCodeDialogOpen(false), []);
    const handleCodeDialogOpen = useCallback(() => setCodeDialogOpen(true), []);
    const handleClearInvitation = useCallback(() => setInvitation(null), []);
    const handleNextPage = useCallback(() => loadData(page + 1), [page]);

    return Children.only(
        cloneElement(
            children,
            {
                loaded,
                pageLoading,
                workspaces,
                hasNextPage: (page + 1) < totalPages,
                createDialogOpen,
                createWorkspaceFormik,
                onCreateDialogClose: handleCreateDialogClose,
                strings,
                onCreateWorkspace: handleCreateDialogOpen,
                onJoinWorkspace: handleCodeDialogOpen,
                onCodeDialogClose: handleCodeDialogClose,
                inviteCodeFormik,
                codeDialogOpen,
                invitation: invitation,
                onJoinConfirm: handleJoinWorkspace,
                onJoinCancel: handleClearInvitation,
                onNextPage: handleNextPage
            }
        )
    );
}

export default WorkspacesViewModel;