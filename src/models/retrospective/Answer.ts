export default class Answer {
    id?: number;
    content?: string;
    column?: string;
    children: Answer[] = [];
    votes?: number;
}