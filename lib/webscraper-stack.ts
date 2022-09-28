import {Duration, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {Architecture, LayerVersion, Runtime} from 'aws-cdk-lib/aws-lambda';
import {resolve} from 'path';
import {LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class WebscraperStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const layerArn = "arn:aws:lambda:eu-west-1:764866452798:layer:chrome-aws-lambda:31";


        const puppeteerLayer = LayerVersion.fromLayerVersionArn(this, 'puppeteer-layer', layerArn)
        const scraperApiFunction = new NodejsFunction(this, 'scraper-api-function', {
            bundling: {
                externalModules: ['@sparticuz/chrome-aws-lambda', 'puppeteer-core'],
                sourceMap: true,
                minify: false,
                tsconfig: resolve(__dirname, '../src/tsconfig.json')
            },
            runtime: Runtime.NODEJS_12_X,
            architecture: Architecture.X86_64,
            timeout: Duration.seconds(30),
            memorySize: 2050,
            entry: resolve(__dirname, '../src/lambdas/scraper.ts'),
            layers: [puppeteerLayer]

        });

        const apiGateway = new RestApi(this, 'scraper-api');
        const roomResource = apiGateway.root.addResource('{roomId}');
        roomResource.addMethod('GET', new LambdaIntegration(scraperApiFunction));
    }
}
