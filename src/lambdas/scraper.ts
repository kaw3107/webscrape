import {APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context} from 'aws-lambda';
import {ScraperController} from '../application/controllers/ScraperController';
import {diContainer} from '../core/di/Registry';
import {ResponseFactory} from '../core/api/ResponseFactory';

const handler = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
    try {
        const controller: ScraperController = diContainer.resolve('ScraperController');
        return await controller.getPropertyDetail(event);
    } catch (e) {
        console.log(e);
        return ResponseFactory.internalServerError();
    }
};
export {handler};