import {AirBnbScraperImpl} from './AirBnbScraperImpl';
import {PropertyScraper} from './PropertyScraper';


export class PropertyScraperFactory {
    public static getFactoryInstance(propertyId: string, provider: string): PropertyScraper {
        switch (provider) {
            case 'air-bnb':
                return new AirBnbScraperImpl(propertyId);
            default:
                throw new Error('Not Implemented')
        }
    }
}