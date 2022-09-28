import {Property} from '../../../data/models/Property';

export interface IScraperService {
    scrapePropertyDetail(id: string, provider: string): Promise<Property>
}