import { Children, cloneElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { StringsContext } from "../../contexts/StringsContext";
import { ViewModelProps } from "../ViewModelProps";
import { WorkspaceContext } from "../../contexts/WorkspaceContext";
import PlanningsClient from "../../infrastructure/clients/planning-poker/PlanningsClient";
import { useLocation, useNavigate } from "react-router";
import { preparePath } from "../../utils/PathUtil";
import paths from '../../routings/paths.json';
import Team from "../../models/team/Team";
import Planning from "../../models/planning/Planning";
import TeamsClient from "../../infrastructure/clients/teams-api/TeamsClient";
import Member from "../../models/member/Member";
import MembersClient from "../../infrastructure/clients/teams-api/MembersClient";
import PlanningItemsClient from "../../infrastructure/clients/planning-poker/PlanningItemsClient";
import PlanningItem from "../../models/planning/PlanningItem";
import { Client, IMessage } from '@stomp/stompjs';
import { createCommand, getMessageType, getPlanningLiveClient, parseMessage, sendCommand } from "../../utils/MeetupUtil";
import ApiConfig from '../../infrastructure/clients/planning-poker/config';
import CommandType from "../../extension/CommandType";
import EstimationPayload from "../../models/live/payloads/EstimationPayload";
import MemberPayload from "../../models/live/payloads/MemberPayload";
import PlanningItemPayload from "../../models/live/payloads/PlanningItemPayload";
import VotingStatusPayload from "../../models/live/payloads/VotingStatusPayload";
import VotesListMessage from "../../models/live/messages/VotesListMessage";
import VotePayload from "../../models/live/payloads/VotePayload";
import MessageType from "../../extension/MessageType";
import { ClassConstructor } from "class-transformer";
import Message from "../../models/live/messages/Message";
import { parse } from "path/posix";
import MemberJoinMessage from "../../models/live/messages/MemberJoinMessage";
import MemberLeftMessage from "../../models/live/messages/MemberLeftMessage";
import MemberVotedMessage from "../../models/live/messages/MemberVotedMessage";
import ItemFocusedMessage from "../../models/live/messages/ItemFocusedMessage";
import ItemEstimatedMessage from "../../models/live/messages/ItemEstimatedMessage";
import VotingStatusMessage from "../../models/live/messages/VotingStatusMessage";
import { mapper } from "../../utils/Mapper";
import IMemberVote from "../../models/live/IMemberVote";
import { EstimationFormModel } from "../../components/forms/EstimationForm";
import { FormikHelpers, FormikProps, useFormik } from "formik";
import mapEstimation from "../../utils/mapEstimation";

const borkerEndpoints = ApiConfig.endpoints.live;

const planningClient = new PlanningsClient();
const workspaceClient = new TeamsClient();
const membersClient = new MembersClient();
const itemsClient = new PlanningItemsClient();
let stompClient: Client|null = null;

const PlanningLiveViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const [workspace, setWorkspace] = useState<Team|undefined>();
    const [members, setMembers] = useState<Member[]>([]);
    const [planning, setPlanning] = useState<Planning|undefined>();
    const [items, setItems] = useState<PlanningItem[]>([]);
    const [voters, setVoters] = useState<Member[]>([]);
    const [focusedItem, setFocusedItem] = useState<PlanningItem|undefined>();
    const [estimatedItems, setEstimatedItems] = useState<PlanningItem[]>([]);
    const [votingEnabled, setVotingEnabled] = useState<boolean>(false);
    const [votes, setVotes] = useState<IMemberVote[]>([]);
    const [itemsToEstimate, setItemsToEstimate] = useState<PlanningItem[]>([]);
    const [started, setStarted] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [completed, setCompleted] = useState<boolean>(false);

    const routeState = useMemo<any>(() => location.state, [location]);
    
    useEffect(() => () => {
        if(stompClient != null && stompClient.connected) {
            stompClient.deactivate();
        }
    }, []);

    const loadData = useCallback(
        async () => {
            try {
                const teamId = routeState?.workspaceId ?? -1;
                const planningId = routeState?.planningId ?? -1;
                const planning = planningClient.getPlanning(planningId);
                const items = itemsClient.getItems(planningId);
                const workspace = workspaceClient.getTeam(teamId);
                const members = membersClient.getTeamMembers(teamId);
                setPlanning(await planning);
                setItems(await items);
                setWorkspace(await workspace);
                setMembers(await members);
                setLoaded(true);
            } catch (e) {
                console.warn(e);
                enqueueSnackbar(strings('/plannings/live/load-fail'), { variant: 'error' });
            }
        }, 
        [routeState, enqueueSnackbar, strings]
    );

    useEffect(() => {
        setItemsToEstimate([...items]);
    }, [items]);


    
    const handleMemberMessage = useCallback((type: string, payload: MemberPayload) => {
        const member = members.find((member) => member.userId === payload.userId);
        switch (type) {
            case MessageType[MessageType.MEMBER_JOIN]:
                enqueueSnackbar(
                    strings('/plannings/live/member-join', member?.firstName, member?.lastName), 
                    { variant: 'info' });
                break;
            case MessageType[MessageType.MEMBER_JOIN]:
                enqueueSnackbar(
                    strings('/plannings/live/member-left', member?.firstName, member?.lastName), 
                    { variant: 'info' });
                break;
            case MessageType[MessageType.MEMBER_VOTED]:
                if(member != null) {
                    setVoters((prev) => [ ...prev, member ]);
                }
                break;
        }
    }, [enqueueSnackbar, strings, JSON.stringify(members)]);

    const handleItemMessage = useCallback((type: string, payload: PlanningItemPayload) => {
        const item = items.find((el) => el.id == payload.id);
        switch(type) {
            case MessageType[MessageType.ITEM_FOCUSED]:
                setStarted(true);
                setFocusedItem(item);
                break;
            case MessageType[MessageType.ITEM_ESTIMATED]:
                setEstimatedItems(
                    (prev) => [
                        {
                            ...item,
                            estimation: mapEstimation(payload.estimation)
                        },
                        ...prev
                    ]
                );
                setItemsToEstimate((prev) => prev.filter((item) => item.id != payload.id))
                break;
        }
    }, [items]);

    const handleVotingStatusMessage = useCallback((type: string, payload: VotingStatusPayload) => {
        setVoters([]);
        setVotingEnabled(payload.enabled ?? false);
    }, []);

    const handleVotingResultMessage = useCallback((type: string, votes: VotePayload[]) => {
        setVotes(votes.map((vote) => ({
            member: members.find((mem) => mem.userId === vote.userId),
            estimation: vote.estimation
        })));
    }, [members]);
    
    const handleResetVoting = useCallback(() => {
        send(CommandType.RESET_VOTES);
    }, []);

    const handlePlanningCompleted = useCallback(() => {
        setCompleted(true);
    }, []);

    const processMessage = useCallback(
        <T extends Message<unknown>>(
            message: IMessage, 
            handler: (type: string, payload: any) => any, 
            targetClass: ClassConstructor<T>
        ) => {
            const parsed = parseMessage(message, targetClass);
            if (parsed.type != null && parsed.payload != null) {
                handler(parsed.type, parsed.payload);
            }
        },
        []
    );
    
    const handleMessage = useCallback(
        (message: IMessage) => {
            switch(getMessageType(message)) {
                case MessageType[MessageType.MEMBER_JOIN]:
                    processMessage(message, handleMemberMessage, MemberJoinMessage);
                    break;
                case MessageType[MessageType.MEMBER_LEFT]:
                    processMessage(message, handleMemberMessage, MemberLeftMessage);
                    break;
                case MessageType[MessageType.MEMBER_VOTED]:
                    processMessage(message, handleMemberMessage, MemberVotedMessage);
                    break;
                case MessageType[MessageType.ITEM_FOCUSED]:
                    processMessage(message, handleItemMessage, ItemFocusedMessage);
                    break;
                case MessageType[MessageType.ITEM_ESTIMATED]:
                    processMessage(message, handleItemMessage, ItemEstimatedMessage);
                    break;
                case MessageType[MessageType.VOTING_STATUS]:
                    processMessage(message, handleVotingStatusMessage, VotingStatusMessage);
                    break;
                case MessageType[MessageType.VOTING_RESULT]:
                    processMessage(message, handleVotingResultMessage, VotesListMessage);
                    break;
                case MessageType[MessageType.PLANNING_COMPLETED]:
                    handlePlanningCompleted();
                    break;
            }
        }, 
        [
            processMessage, 
            handlePlanningCompleted,
            handleMemberMessage,
            handleItemMessage,
            handleVotingStatusMessage,
            handleVotingResultMessage,
            members
        ]
    );

    const subscribeEndpoint = useCallback((client: Client, endpoint: string, planningId: number) => {
        client.subscribe(preparePath(endpoint, { planningId }), handleMessage);
    }, [handleMessage]);

    const connect = useCallback(() => {
        const token: string = routeState?.token ?? '';
        const planningId: number = routeState?.planningId ?? -1;
        stompClient = getPlanningLiveClient(token);
        stompClient.onConnect = (frame) => {
            if(stompClient == null) {
                return;
            }
            enqueueSnackbar(strings('/plannings/live/connected'), { variant: 'success' });
            subscribeEndpoint(stompClient, borkerEndpoints.members, planningId);
            subscribeEndpoint(stompClient, borkerEndpoints.status, planningId);
            subscribeEndpoint(stompClient, borkerEndpoints.focus, planningId);
            subscribeEndpoint(stompClient, borkerEndpoints.votes, planningId);
            subscribeEndpoint(stompClient, borkerEndpoints.estimations, planningId);
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

    const send = useCallback((commandType: CommandType, payload?: any) => {
        const command = createCommand(commandType, payload);
        if(stompClient != null) {
            sendCommand(command, stompClient, "/command")
        }
    }, []);

    const handleRunPlanning = useCallback(() => {
        send(CommandType.RUN);
    }, []);

    const handleStopVoting = useCallback(() => {
        send(CommandType.STOP_VOTING);
    }, []);

    const handleEstimate = useCallback(
        (values: EstimationFormModel, helpers: FormikHelpers<EstimationFormModel>) => {
            const payload: EstimationPayload = {
                itemId: focusedItem?.id, 
                estimation: values.estimation 
            };
            send(CommandType.ESTIMATE, payload);
            helpers.setStatus({ success: true });
            helpers.resetForm();
        }, 
        [focusedItem]
    );

    const estimationFormik = useFormik<EstimationFormModel>({
        initialValues: {
            estimation: 'S'
        },
        onSubmit: handleEstimate
    })

    return Children.only(
        cloneElement(
            children,
            {
                strings,
                planning,
                workspace,
                onRun: handleRunPlanning,
                onStopVoting: handleStopVoting,
                onResetVoting: handleResetVoting,
                started,
                itemsToEstimate,
                focusedItem,
                estimatedItems,
                votingEnabled,
                voters,
                votes,
                estimationFormik,
                completed
            }
        )
    );
}

export default PlanningLiveViewModel;