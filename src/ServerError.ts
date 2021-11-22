export class ServerError extends Error {
    constructor(public statusCode: number, public statusText: string, e?: string) {
        super(e);
        this.name = new.target.name;
    }
}