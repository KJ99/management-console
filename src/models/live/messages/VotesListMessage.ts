import VotePayload from "../payloads/VotePayload";
import Message from "./Message";

export default class VotesListMessage extends Message<VotePayload[]> {};
