export default abstract class Message<T> {
    type?: string;
    createdAt?: string;
    payload?: T;
}