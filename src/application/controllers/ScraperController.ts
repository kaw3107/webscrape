import {inject, injectable} from 'tsyringe';
import {APIRequest, APIResponse} from '../../core/api/Types';
import {IScraperService} from '../services/interfaces/IScraperService';
import {ResponseFactory} from '../../core/api/ResponseFactory';

@injectable()
export class ScraperController {
    constructor(@inject('IScraperService') private scraperService: IScraperService) {
    }

    async getPropertyDetail(request: APIRequest): Promise<APIResponse> {
        try {
            if (request.pathParameters && request.pathParameters.roomId && request.queryStringParameters && request.queryStringParameters.provider) {
                const property = await this.scraperService.scrapePropertyDetail(request.pathParameters.roomId, request.queryStringParameters.provider);
                return property ? ResponseFactory.ok(property) : ResponseFactory.notFound();
            }
            return ResponseFactory.badRequest('Bad Request');
        } catch (e) {
            return ResponseFactory.internalServerError('Internal Server Error');
        }
    }
}