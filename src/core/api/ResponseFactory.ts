import {ResponseWriter} from './ResponseWriter';
import {APIResponse} from './Types';

export class ResponseFactory extends ResponseWriter {
    public static ok(payload?: any): APIResponse {
        return this.objectResponse(200, payload);
    }

    public static badRequest(message?: string | object): APIResponse {
        return message ? this.objectResponse(400, message) : this.objectResponse(400, 'Bad Request');
    }

    public static internalServerError(message?: string): APIResponse {
        return message ? this.objectResponse(500, message) : this.objectResponse(500, 'Internal Server Error');

    }

    static notFound(message?: string): APIResponse {
        return message ? this.objectResponse(404, message) : this.objectResponse(404, 'Not Found');
    }
}