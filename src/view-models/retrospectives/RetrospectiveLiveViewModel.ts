import { Children, cloneElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { StringsContext } from "../../contexts/StringsContext";
import { ViewModelProps } from "../ViewModelProps";
import { WorkspaceContext } from "../../contexts/WorkspaceContext";
import ActionItemsClient from "../../infrastructure/clients/retro-helper/ActionItemsClient";
import ActionItem from "../../models/retrospective/ActionItem";
import { mapper } from "../../utils/Mapper";
import ActionItemUpdateModel from "../../models/retrospective/ActionItemUpdateModel";
import MembersClient from "../../infrastructure/clients/teams-api/MembersClient";
import Member from "../../models/member/Member";
import Retrospective from "../../models/retrospective/Retrospective";
import { ActionItemFormModel } from "../../components/forms/ActionItemForm";
import { FormikHelpers, useFormik } from "formik";
import Answer from "../../models/retrospective/Answer";
import RetroStep from "../../extension/RetroStep";
import  * as Yup from 'yup'
import moment from "moment";
import { Client, IMessage } from "@stomp/stompjs";
import RetrospectivesClient from "../../infrastructure/clients/retro-helper/RetrospectivesClient";
import { useLocation } from "react-router";
import TeamsClient from "../../infrastructure/clients/teams-api/TeamsClient";
import Team from "../../models/team/Team";
import RetroStatusPayload from "../../models/live/payloads/RetroStatusPayload";
import AnswerPayload from "../../models/live/payloads/AnswerPayload";
import Message from "../../models/live/messages/Message";
import { ClassConstructor } from "class-transformer";
import { getMessageType, getRetroLiveClient, parseMessage } from "../../utils/MeetupUtil";
import MessageType from "../../extension/MessageType";
import AnswerMessage from "../../models/live/messages/AnswerMessage";
import RetroStatusMessage from "../../models/live/messages/RetroStatusMessage";
import MemberPayload from "../../models/live/payloads/MemberPayload";
import MemberJoinMessage from "../../models/live/messages/MemberJoinMessage";
import MemberLeftMessage from "../../models/live/messages/MemberLeftMessage";
import { preparePath } from "../../utils/PathUtil";
import ApiConfig from '../../infrastructure/clients/retro-helper/config';
import RetroStatus from "../../extension/RetroStatus";
import AnswersClient from "../../infrastructure/clients/retro-helper/AnswersClient";
import ActionItemModel from "../../models/retrospective/ActionItemModel";
import BadRequestError from "../../infrastructure/api/exceptions/BadRequestError";
import { processFormError } from "../../utils/ErrorProcessor";

const retroClient = new RetrospectivesClient();
const actionItemsClient = new ActionItemsClient();
const answersClient = new AnswersClient();
const membersClient = new MembersClient();
const workspaceClient = new TeamsClient();
const borkerEndpoints = ApiConfig.endpoints.live;

let stompClient: Client|null = null;

const RetrospectiveLiveViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const { enqueueSnackbar } = useSnackbar();
    const [loaded, setLoaded] = useState(false);
    const [workspace, setWorkspace] = useState<Team|undefined>();
    const [retro, setRetro] = useState<Retrospective|undefined>();
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [step, setStep] = useState<RetroStep>(RetroStep.ANSWER);
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [actionToUpdate, setActionToUpdate] = useState<ActionItem|undefined>();
    const [creatingAction, setCreatingAction] = useState<boolean>(false);
    const [members, setMembers] = useState<Member[]>([]);
    const location = useLocation();
    const [completed, setCompleted] = useState<boolean>(false);
    
    const routeState = useMemo<any>(() => location.state, [location]);

    useEffect(() => () => {
        if(stompClient != null && stompClient.connected) {
            stompClient.deactivate();
        }
    }, []);

    const loadAnswers = useCallback(async () => {
        const retroId = routeState?.retroId ?? -1;
        const result = await answersClient.getAnswers({ retroId });
        setAnswers(result);
    }, [routeState]);

    const loadActionItems = useCallback(async () => {
        const retroId = routeState?.retroId ?? -1;
        const result = await actionItemsClient.getActionItems({ retroId });
        setActionItems(result);
    }, [routeState]);

    const loadData = useCallback(
        async () => {
            try {
                const teamId = routeState?.workspaceId ?? -1;
                const retroId = routeState?.retroId ?? -1;
                const retro = retroClient.get(retroId)
                const workspace = workspaceClient.getTeam(teamId);
                const members = membersClient.getTeamMembers(teamId);
                setRetro(await retro);
                setWorkspace(await workspace);
                setMembers(await members);
                setLoaded(true);
            } catch (e) {
                console.warn(e);
                enqueueSnackbar(strings('/retro/live/load-fail'), { variant: 'error' });
            }
        }, 
        [routeState, enqueueSnackbar, strings]
    );

    const handleStatusMessage = useCallback((type: MessageType, payload: RetroStatusPayload) => {
        let status = payload?.status ?? '';
        let step: RetroStep;
        switch (status) {
            case RetroStatus[RetroStatus.VOTING]:
                step = RetroStep.VOTE;
                break;
            case RetroStatus[RetroStatus.SUMMARIZING]:
                step = RetroStep.SUMMARIZE;
                loadAnswers();
                break;
            default:
                step = RetroStep.ANSWER;
                break;
        }
        setStep(step);
    }, []);

    const handleAnswerMessage = useCallback((type: string, payload: AnswerPayload) => {
        console.log('handle answer', type)
        if(type === MessageType[MessageType.ANSWER_CREATED]) {
            console.log('add')
            setAnswers((prev) => [
                ...prev,
                mapper.map(payload, Answer, AnswerPayload)
            ]);
        } else if (type == MessageType[MessageType.ANSWER_DELETED]) {
            console.log('delete')
            setAnswers((prev) => {
                const current = [...prev];
                const index = current.findIndex(it => it.id == payload.id);
                console.log(index);
                if(index >= 0) {
                    current.splice(index, 1);
                }
                
                return current;
            })
        }
    }, []);

    const handleRetroFinishedMessage = useCallback(() => {
        setCompleted(true);
    }, []);

    const handleMemberJoin = useCallback((type: string, payload: MemberPayload) => {
        const member = members.find((member) => member.userId === payload.userId);
        enqueueSnackbar(
            strings('/retro/live/member-join', member?.firstName, member?.lastName), 
            { variant: 'info' });
    }, []);
    
    const handleMemberLeft = useCallback((type: MessageType, payload: MemberPayload) => {
        const member = members.find((member) => member.userId === payload.userId);
        enqueueSnackbar(
            strings('/retro/live/member-left', member?.firstName, member?.lastName), 
            { variant: 'info' }
        );
    }, []);

    const processMessage = useCallback(
        <T extends Message<unknown>>(
            message: IMessage, 
            handler: (type: any, payload: any) => any, 
            targetClass: ClassConstructor<T>
        ) => {
            const parsed = parseMessage(message, targetClass);
            console.log(parsed)
            if (parsed.type != null && parsed.payload != null) {
                handler(parsed.type, parsed.payload);
            }
        },
        []
    );

    const handleMessage = useCallback(
        (message: IMessage) => {
            console.log(message.body)
            switch(getMessageType(message)) {
                case MessageType[MessageType.MEMBER_JOIN]:
                    processMessage(message, handleMemberJoin, MemberJoinMessage);
                    break;
                case MessageType[MessageType.MEMBER_LEFT]:
                    processMessage(message, handleMemberLeft, MemberLeftMessage);
                    break;
                case MessageType[MessageType.ANSWER_CREATED]:
                case MessageType[MessageType.ANSWER_DELETED]:
                    processMessage(message, handleAnswerMessage, AnswerMessage);
                    break;
                case MessageType[MessageType.STATUS_CHANGED]:
                    processMessage(message, handleStatusMessage, RetroStatusMessage);
                    break;
                case MessageType[MessageType.RETRO_FINISHED]:
                    handleRetroFinishedMessage();
                    break;
            }
        }, 
        [
            processMessage,
            handleMemberJoin,
            handleMemberLeft,
            handleAnswerMessage,
            handleStatusMessage,
            handleRetroFinishedMessage,
            members
        ]
    );

    const subscribeEndpoint = useCallback((client: Client, endpoint: string, retroId: number) => {
        client.subscribe(preparePath(endpoint, { retroId }), handleMessage);
    }, [handleMessage]);

    const handleActionItemCreate = useCallback(
        (values: ActionItemFormModel, helpers: FormikHelpers<ActionItemFormModel>) => {
            const model = mapper.map(values, ActionItemModel, ActionItemFormModel);
            model.retrospectiveId = routeState?.retroId ?? -1;
            actionItemsClient.createActionItem(model)
                .then(() => {
                    loadActionItems();
                    setCreatingAction(false);
                    helpers.resetForm();
                })
                .catch(e => {
                    if(e instanceof BadRequestError) {
                        helpers.setErrors(processFormError(e.errors));
                    } else {
                        enqueueSnackbar(strings('/errors/unknown'), {variant: 'error'});
                    }
                })
        },
        [routeState, enqueueSnackbar, strings, loadActionItems]
    );

    const connect = useCallback(() => {
        const token: string = routeState?.token ?? '';
        const retroId: number = routeState?.retroId ?? -1;
        stompClient = getRetroLiveClient(token);
        stompClient.onConnect = (frame) => {
            if(stompClient == null) {
                return;
            }
            enqueueSnackbar(strings('/retro/live/connected'), { variant: 'success' });
            subscribeEndpoint(stompClient, borkerEndpoints.members, retroId);
            subscribeEndpoint(stompClient, borkerEndpoints.status, retroId);
            subscribeEndpoint(stompClient, borkerEndpoints.answers, retroId);
        }
        const onError = (e: any) => {
            console.warn(e);
            enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' })
        };
        stompClient.onStompError = onError;
        stompClient.onWebSocketError = onError;


        stompClient.activate();

    }, [routeState, enqueueSnackbar, strings, subscribeEndpoint]);

    useEffect(() => {
        if (loaded) {
            connect();
        }
    }, [loaded, connect]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleActionItemUpdate = useCallback(
        (values: ActionItemFormModel, helpers: FormikHelpers<ActionItemFormModel>) => {
            if(actionToUpdate == null) {
                return;
            }
            const model = mapper.map(values, ActionItemUpdateModel, ActionItemFormModel);
            actionItemsClient.updateActionItem(actionToUpdate, model)
                .then(() => {
                    loadActionItems();
                    setActionToUpdate(undefined);
                })
                .catch(e => {
                    if(e instanceof BadRequestError) {
                        helpers.setErrors(processFormError(e.errors));
                    } else {
                        enqueueSnackbar(strings('/errors/unknown'), {variant: 'error'});
                    }
                });
        },
        [actionToUpdate, enqueueSnackbar, strings, loadActionItems]
    );

    const handleActionItemDelete = useCallback((item: ActionItem) => {
        if (item.id == null) {
            return;
        }
        actionItemsClient.delete(item.id)
            .then(() => loadActionItems())
            .catch(e => enqueueSnackbar(strings('/errors/unknown'), {variant: 'error'}))
    }, [loadActionItems, enqueueSnackbar, strings]);

    const actionItemCreateFormik = useFormik<ActionItemFormModel>({
        initialValues: {
            title: ''
        },
        onSubmit: handleActionItemCreate,
        validationSchema: Yup.object({
            title: Yup.string().test({
                name: 'non-empty',
                message: '/errors/non-empty',
                test: (val) => typeof val == 'string' && val.trim().length > 0
            })
        })
    });

    const actionItemUpdateFormik = useFormik<ActionItemFormModel>({
        initialValues: {
            title: ''
        },
        onSubmit: handleActionItemUpdate,
        validationSchema: Yup.object({
            title: Yup.string().test({
                name: 'non-empty',
                message: '/errors/non-empty',
                test: (val) => typeof val == 'string' && val.trim().length > 0
            })
        })
    });

    const handleNextStep = useCallback(() => {
        const retroId: number = routeState?.retroId ?? -1;
        retroClient.nextStep(retroId);
    }, [routeState]);

    const handleSelectActionToUpdate = useCallback((action: ActionItem) => setActionToUpdate(action), []);
    const handleActionUpdateCancel = useCallback(() => setActionToUpdate(undefined), []);
    const handleActionCreateInit = useCallback(() => setCreatingAction(true), []);
    const handleActionCreateCancel = useCallback(() => setCreatingAction(false), []);

    useEffect(() => {
        if (actionToUpdate == null) {
            actionItemUpdateFormik.resetForm();
        } else {
            actionItemUpdateFormik.setValues({
                title: actionToUpdate.title ?? '',
                dueDate: actionToUpdate.dueDate != null
                    ? moment(actionToUpdate.dueDate)
                    : moment(),
                assignee: members.find((member) => member.userId === actionToUpdate.assigneeId)
            });
        }
    }, [actionToUpdate, actionItemUpdateFormik.setValues, actionItemUpdateFormik.resetForm, members]);

    useEffect(() => {
        if (step === RetroStep.VOTE) {
            setAnswers([]);
            loadAnswers();
        } else if (step === RetroStep.SUMMARIZE) {
            loadActionItems();
        }
    }, [step, loadAnswers, loadActionItems]);

    return Children.only(
        cloneElement(
            children,
            {
                strings,
                workspace,
                retro,
                answers,
                step,
                actionItems,
                actionToUpdate,
                creatingAction,
                members,
                actionCreateFormik: actionItemCreateFormik,
                actionUpdateFormik: actionItemUpdateFormik,
                onNextStep: handleNextStep,
                onDeleteAction: handleActionItemDelete,
                onCreateAction: handleActionCreateInit,
                onEditAction: handleSelectActionToUpdate,
                onEditActionCancel: handleActionUpdateCancel,
                onCreateActionCancel: handleActionCreateCancel,
                completed
            }
        )
    );
}

export default RetrospectiveLiveViewModel;