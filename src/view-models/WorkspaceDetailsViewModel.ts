import { FormikHelpers, FormikProps, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { Children, cloneElement, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { MemberRolesFormModel } from "../components/forms/MemberRolesForm";
import { WorkspaceFormModel } from "../components/forms/WorkspaceForm";
import { StringsContext } from "../contexts/StringsContext";
import { WorkspaceContext } from "../contexts/WorkspaceContext";
import WorkspaceTheme from "../extension/WorkspaceTheme";
import BadRequestError from "../infrastructure/api/exceptions/BadRequestError";
import NotFoundError from "../infrastructure/api/exceptions/NotFoundError";
import InvitationsClient from "../infrastructure/clients/teams-api/InvitationsClient";
import MembersClient from "../infrastructure/clients/teams-api/MembersClient";
import TeamsClient from "../infrastructure/clients/teams-api/TeamsClient";
import TeamsResourcesClient from "../infrastructure/clients/teams-api/TeamsResourcesClient";
import Member from "../models/member/Member";
import MemberUpdateModel from "../models/member/MemberUpdateModel";
import Team from "../models/team/Team";
import TeamUpdateModel from "../models/team/TeamUpdateModel";
import { processFormError } from "../utils/ErrorProcessor";
import { mapper } from "../utils/Mapper";
import { ViewModelProps } from "./ViewModelProps";

const teamsClient = new TeamsClient();
const membersClient = new MembersClient();
const invitationsClient = new InvitationsClient();

const WorkspaceDetailsViewModel = ({ children }: ViewModelProps) => {
    const { setWorkspace: setGlobalWorkspace } = useContext(WorkspaceContext);
    const { strings } = useContext(StringsContext);
    const { workspaceId } = useParams();
    const [workspace, setWorkspace] = useState<Team|undefined>();
    const [members, setMembers] = useState<Member[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [invitationPin, setInvitationPin] = useState<string|undefined>();
    const { enqueueSnackbar } = useSnackbar();
    const [focusedMember, setFocusedMember] = useState<Member|undefined>();
    const [memberToRemove, setMemberToRemove] = useState<Member|undefined>();
    const [editMode, setEditMode] = useState<boolean>(false);
    const load = useCallback(
        async () => {
            try {
                setLoaded(false);
                setFocusedMember(undefined);
                setMemberToRemove(undefined);
                const id = parseInt(workspaceId ?? '-1');
                const workspace = await teamsClient.getTeam(id);
                const members = await membersClient.getTeamMembers(id);
                setWorkspace(workspace);
                setMembers(members ?? []);
            } catch(e) {    
                if(e instanceof NotFoundError) {
                    enqueueSnackbar(strings('/errors/not-found'), { variant: 'error' });
                } else {
                    enqueueSnackbar(strings('/errors/unknonw'), { variant: 'error' });
                }
            } finally {
                setLoaded(true);
            }
        },
        [enqueueSnackbar, strings, workspaceId]
    );

    useEffect(() => {
        load();
    }, [load]);

    const handleEditMember = useCallback(
        (values: MemberRolesFormModel, helpers: FormikHelpers<MemberRolesFormModel>) => {
            if (focusedMember != null && workspaceId != null) {
                const teamId = parseInt(workspaceId);
                const userId = focusedMember.userId ?? '-1';
                const model = mapper.map(values, MemberUpdateModel, MemberRolesFormModel);
                membersClient.update(teamId, userId, focusedMember, model)
                    .then(() => {
                        enqueueSnackbar(
                            strings(
                                '/workspaces/member-edit-success', 
                                focusedMember.firstName, 
                                focusedMember.lastName
                            ),
                            { variant: 'success' }
                        );
                        load();
                    })
                    .catch(
                        (_) => 
                            enqueueSnackbar(
                                strings(
                                    '/workspaces/member-edit-fail', 
                                    focusedMember.firstName, 
                                    focusedMember.lastName
                                ),
                                { variant: 'error' }
                            )
                    );
            }
        },
        [enqueueSnackbar, load, strings, focusedMember]
    );

    const rolesFormik = useFormik<MemberRolesFormModel>({
        enableReinitialize: true,
        initialValues: { roles: []},
        onSubmit: handleEditMember
    });

    const handleInvite = useCallback(
        () => {
            invitationsClient.create({ teamId: parseInt(workspaceId ?? '-1') })
                .then((invitation) => setInvitationPin(invitation.code))
                .catch((_) => enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' }));
        },
        [workspaceId, strings, enqueueSnackbar]
    );

    const handleInvitationCancel = useCallback(
        () => {
            if (invitationPin != null) {
                invitationsClient.delete(invitationPin)
                    .then((invitation) => setInvitationPin(undefined))
                    .catch((_) => enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' }));
            }
        },
        [invitationPin, strings, enqueueSnackbar]
    );

    const handleEditMemberRoles = useCallback((member: Member) => setFocusedMember(member), []);
    const handleEditMemberRolesCancel = useCallback(() => setFocusedMember(undefined), []);

    useEffect(() => {
        const roles = focusedMember?.roles?.map((role) => role.code) ?? [];
        rolesFormik.setFieldValue('roles', roles);
    }, [focusedMember, rolesFormik.setFieldValue]);

    const handleRemoveMemberConfirm = useCallback(() => {
        if (memberToRemove != null) {
            const teamId = parseInt(workspaceId ?? '-1');
            const userId = memberToRemove.userId ?? 'undefined';
            membersClient.delete(teamId, userId)
                .then(() => {
                    enqueueSnackbar(
                        strings('/workspaces/member-delete-success', memberToRemove.firstName, memberToRemove.lastName),
                        { variant: 'success' }
                    );
                    load();
                })
                .catch((_) => {
                    enqueueSnackbar(
                        strings('/workspaces/member-delete-fail', memberToRemove.firstName, memberToRemove.lastName),
                        { variant: 'error' }
                    );
                });
        }
    }, [load, enqueueSnackbar, strings, memberToRemove]);

    const handleWorkspaceEdit = useCallback(
        async (values: WorkspaceFormModel, helpers: FormikHelpers<WorkspaceFormModel>) => {
            if(workspace == null) {
                return;
            }
            const model = mapper.map(values, TeamUpdateModel, WorkspaceFormModel);
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
            } else {
                model.pictureId = workspace.pictureId;
            }
            
            try {
                await teamsClient.updateTeam(workspace, model);
                enqueueSnackbar(strings('/workspaces/edit-success'), { variant: 'success' });
                helpers.resetForm();
                setEditMode(false);
                load();
            } catch (e) {
                if (e instanceof BadRequestError) {
                    helpers.setErrors(processFormError(e.errors));
                } else {
                    enqueueSnackbar(strings('/workspaces/edit-fail', { variant: 'error' }));
                }
            } finally {
                helpers.setSubmitting(false);
            }   
        },
        [load, enqueueSnackbar, strings, workspace]
    );

    const editWorkspaceFormik = useFormik<WorkspaceFormModel>({
        initialValues: {
            name: '',
            theme: WorkspaceTheme[WorkspaceTheme.SEA]
        },
        onSubmit: handleWorkspaceEdit
    });

    useEffect(() => {
        if (workspace != null) {
            editWorkspaceFormik.setValues(mapper.map(workspace, WorkspaceFormModel, Team));
        }
    }, [workspace, editWorkspaceFormik.setValues]);

    useEffect(() => {
        if(workspace != null) {
            setGlobalWorkspace(workspace);
        }
    }, [workspace, setGlobalWorkspace]);

    const handleRemoveMemberCancel = useCallback(() => setMemberToRemove(undefined), []);
    const handleSelectMemberToRemove = useCallback((member: Member) => setMemberToRemove(member), []);
    const handleEnterEditMode = useCallback(() => setEditMode(true), []);
    const handleQuitEditMode = useCallback(() => setEditMode(false), []);


    return Children.only(
        cloneElement(
            children,
            {
                strings,
                loaded,
                workspace,
                members,
                invitationPin,
                onInvite: handleInvite,
                onInvitationCancel: handleInvitationCancel,
                focusedMember,
                onMemberEdit: handleEditMemberRoles,
                onMemberEditCancel: handleEditMemberRolesCancel,
                memberRolesFormik: rolesFormik,
                memberToRemove,
                onMemberToRemoveSelect: handleSelectMemberToRemove,
                onMemberRemoveCancel: handleRemoveMemberCancel,
                onMemberRemoveConfirm: handleRemoveMemberConfirm,
                editMode,
                onEnterEditMode: handleEnterEditMode,
                onQuitEditMode: handleQuitEditMode,
                workspaceEditFormik: editWorkspaceFormik
            }
        )
    );
}

export default WorkspaceDetailsViewModel;