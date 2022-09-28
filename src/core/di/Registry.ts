import 'reflect-metadata';

import {container} from 'tsyringe';
import {ScraperService} from '../../application/services/implementation/ScraperService';
import {ScraperController} from '../../application/controllers/ScraperController';

container.register('IScraperService', ScraperService);
container.register('ScraperController', ScraperController);

export const diContainer = container;