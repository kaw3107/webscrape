import {APIResponse} from './Types';

export class ResponseWriter {

    protected static objectResponse(statusCode: number, body: any): APIResponse {

        const response = {
            statusCode,
        } as APIResponse;

        if (body && typeof body === 'object') {
            response.body = JSON.stringify(body);
        }

        return response;
    }
}