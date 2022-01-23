import planningConfig from '../infrastructure/clients/planning-poker/config';
import retroConfig from '../infrastructure/clients/retro-helper/config';
import joinUrl from 'url-join';
import { preparePath } from './PathUtil';
import { Client, IMessage } from '@stomp/stompjs';
import Command from '../models/live/commands/Command';
import CommandType from '../extension/CommandType';
import { convert } from './CaseConverter';
import Naming from '../extension/Naming';
import MessageType from '../extension/MessageType';
import { ClassConstructor, instanceToPlain, plainToInstance } from 'class-transformer';
import MemberJoinMessage from '../models/live/messages/MemberJoinMessage';
import { format } from './ObjectFormatter';
import RetroStatusMessage from '../models/live/messages/RetroStatusMessage';
import AnswerMessage from '../models/live/messages/AnswerMessage';
import RetroCompletedMessage from '../models/live/messages/RetroCompletedMessage';

const DefaultPublishDestination = '/command';

export const getPlanningLiveClient = (key: string) => {
    const host = planningConfig.liveHost;
    const endpoint = planningConfig.endpoints.live.base;
    const client = new Client();
    client.brokerURL = preparePath(joinUrl(host, endpoint), null, { key });;

    return client;
}

export const getRetroLiveClient = (key: string) => {
    const host = retroConfig.liveHost;
    const endpoint = retroConfig.endpoints.live.base;
    const client = new Client();
    client.brokerURL = preparePath(joinUrl(host, endpoint), null, { key });;

    return client;
}

export const createCommand = <T>(type: CommandType, payload?: T) => {
    const command = new Command<T>();
    command.type = CommandType[type];
    command.payload = payload;

    return command;
}

export const sendCommand = <T extends Command<unknown>>(
    command: T, 
    client: Client, 
    destination: string = DefaultPublishDestination
) => {
    const body = JSON.stringify(convert(instanceToPlain(command), Naming.SNAKE_CASE));
    format(body);
    client.publish({
        destination,
        body: body
    });
};

export const getMessageType = (message: IMessage) => {
    return JSON.parse(message.body)?.type;
}

export const parseMessage = <T>(message: IMessage, messageClass: ClassConstructor<T>) => {
    const json = convert(JSON.parse(message.body), Naming.CAMEL_CASE);
    return plainToInstance(messageClass, json);
}

export const parseMessageByType = (message: IMessage) => {
    const json = convert(JSON.parse(message.body), Naming.CAMEL_CASE);
    let result;

    switch (json?.type) {        
        case MessageType[MessageType.MEMBER_JOIN]:
            result = plainToInstance(MemberJoinMessage, json);
            break;
        case MessageType[MessageType.MEMBER_LEFT]:
            result = plainToInstance(MemberJoinMessage, json);
            break;
        case MessageType[MessageType.ITEM_FOCUSED]:
            result = plainToInstance(MemberJoinMessage, json);
            break;
        case MessageType[MessageType.VOTING_STATUS]:
            result = plainToInstance(MemberJoinMessage, json);
            break;
        case MessageType[MessageType.VOTING_RESULT]:
            result = plainToInstance(MemberJoinMessage, json);
            break;
        case MessageType[MessageType.MEMBER_VOTED]:
            result = plainToInstance(MemberJoinMessage, json);
            break;
        case MessageType[MessageType.ITEM_ESTIMATED]:
            result = plainToInstance(MemberJoinMessage, json);
            break;
        case MessageType[MessageType.PLANNING_COMPLETED]:
            result = plainToInstance(MemberJoinMessage, json);
            break;
        case MessageType[MessageType.STATUS_CHANGED]:
            result = plainToInstance(RetroStatusMessage, json);
            break;
        case MessageType[MessageType.ANSWER_CREATED]:
        case MessageType[MessageType.ANSWER_DELETED]:
            result = plainToInstance(AnswerMessage, json);
            break;
        case MessageType[MessageType.RETRO_FINISHED]:
            result = plainToInstance(RetroCompletedMessage, json);
            break;
        default:
            result = plainToInstance(MemberJoinMessage, json);
        break;
    }

    return result;
}