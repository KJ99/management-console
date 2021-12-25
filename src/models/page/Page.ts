import PageMetadata from "./PageMetadata";

export default class Page<T> {
    metadata?: PageMetadata;
    data?: T[]
}