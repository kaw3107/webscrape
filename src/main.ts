
import {IScraperService} from './application/services/interfaces/IScraperService';
import {diContainer} from './core/di/Registry';
import {APIGatewayProxyEventV2} from 'aws-lambda';
import {handler} from './lambdas/scraper';

export const dummyContext = {
    callbackWaitsForEmptyEventLoop: true,
    functionVersion: '$LATEST',
    functionName: 'foo-bar-function',
    memoryLimitInMB: '128',
    logGroupName: '/aws/lambda/foo-bar-function',
    logStreamName: '2021/03/09/[$LATEST]abcdef123456abcdef123456abcdef123456',
    invokedFunctionArn: 'arn:aws:lambda:eu-west-1:123456789012:function:foo-bar-function',
    awsRequestId: 'c6af9ac6-7b61-11e6-9a41-93e812345678',
    getRemainingTimeInMillis: () => 1234,
    done: () => console.log('Done!'),
    fail: () => console.log('Failed!'),
    succeed: () => console.log('Succeeded!'),
};

class Main {
    constructor() {

    }

    async test() {
        //@ts-ignore
        const event: APIGatewayProxyEventV2 = {
            queryStringParameters: {
                'provider': 'air-bnb'
            },
            pathParameters: {
                'roomId': '43543920'
            }
        };
        const res = await handler(event, dummyContext)
        console.log(res)
    }

}
const main = new Main();
const res = new Promise(() => main.test())
