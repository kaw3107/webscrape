import {IScraperService} from '../interfaces/IScraperService';
import {injectable} from 'tsyringe';
import {PropertyScraperFactory} from '../../../core/scrapers/PropertyScraperFactory';
import {Property} from '../../../data/models/Property';

@injectable()
export class ScraperService implements IScraperService {
    constructor() {
    }

    async scrapePropertyDetail(id: string, provider: string): Promise<Property> {
        return await PropertyScraperFactory.getFactoryInstance(id, provider).scrapeProperty();
    }

}