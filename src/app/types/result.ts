export class Result {
    success: boolean;
    message: string;
}
export class GResult<T> extends Result {
    value: T;
}

