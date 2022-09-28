import {PropertyScraper} from './PropertyScraper';
import {Amenities, Property} from '../../data/models/Property';
import * as cheerio from 'cheerio';

const FactoryConstants = {
    BASE_URL: 'https://www.airbnb.co.uk/rooms/',
    PROPERTY_TYPE_SELECTOR: '._tqmy57 > div > h2',
    PROPERTY_NAME_SELECTOR: '._fecoyn4',
    PROPERTY_BEDROOMS_SELECTOR: '._tqmy57 > ol > li:nth-child(2) > span:nth-child(2)',
    PROPERTY_BATHROOMS_SELECTOR: '._tqmy57 > ol > li:nth-child(4) > span:nth-child(2)',
    PROPERTY_AMENITIES_BTN_SELECTOR: '.b65jmrv',
    PROPERTY_MODAL_SECTIONS_SELECTOR: '._11jhslp',
    PROPERTY_MODAL_SECTION_GROUP_HEADING_SELECTOR: '._14i3z6h',
    PROPERTY_MODAL_SECTION_GROUP_AMENITY: '._gw4xx4',
    PROPERTY_MODAL_SELECTION_GROUP_AMENITY_UNAVAILABLE: '.a8jt5op'
}

export class AirBnbScraperImpl extends PropertyScraper {
    private readonly _propertyId: string;

    constructor(propertyId: string) {
        super();
        this._propertyId = propertyId;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    protected async extractAndSetAmenities(html: string): Promise<void> {
        try {
            this.amenities = [];
            await this.currentPage.click(FactoryConstants.PROPERTY_AMENITIES_BTN_SELECTOR);
            await this.currentPage.waitForSelector(FactoryConstants.PROPERTY_MODAL_SECTIONS_SELECTOR);
            const htmlWithAmenitiesModal = await this.currentPage.$$eval(FactoryConstants.PROPERTY_MODAL_SECTIONS_SELECTOR, x => {
                return x.map(y => y.innerHTML);
            });
            for (const i of htmlWithAmenitiesModal) {
                const $ = cheerio.load(i);
                let amenities: Amenities = {
                    amenity: [],
                    group: $(FactoryConstants.PROPERTY_MODAL_SECTION_GROUP_HEADING_SELECTOR).text()
                };
                if(amenities.group !== 'Not included') {
                    $(FactoryConstants.PROPERTY_MODAL_SECTION_GROUP_AMENITY).each((index, element) => {
                        amenities.amenity.push($(element).text());
                    });
                } else {
                    $(FactoryConstants.PROPERTY_MODAL_SELECTION_GROUP_AMENITY_UNAVAILABLE).each((index, element) => {
                        amenities.amenity.push($(element).text().replace('Unavailable: ', ''));
                    });
                }
                this.amenities.push(amenities);
            }
        } catch (e) {
            console.log(e);
            throw new Error('Error parsing property metadata');
        }
    }

    protected extractAndSetBathrooms(html: string): void {
        try {
            const $ = cheerio.load(html);
            const text = $(FactoryConstants.PROPERTY_BATHROOMS_SELECTOR).text();
            this.bathrooms = text.includes('bathroom') ?
                Number(text.replace(' bathroom', '')) : Number(text.replace(' bathrooms', ''));
        } catch (e) {
            console.log(e);
            throw new Error('Error parsing property metadata');
        }
    }

    protected extractAndSetBedrooms(html: string): void {
        try{
            const $ = cheerio.load(html);
            const text = $(FactoryConstants.PROPERTY_BEDROOMS_SELECTOR).text();
            this.bedrooms = text.includes('bedroom') ?
                Number(text.replace(' bedroom', '')) : Number(text.replace(' bedrooms', ''));
        } catch (e) {
            console.log(e);
            throw new Error('Error parsing property metadata');
        }
    }

    protected extractAndSetName(html: string): void {
        try {
            const $ = cheerio.load(html);
            this.name = $(FactoryConstants.PROPERTY_NAME_SELECTOR).text();
        } catch (e) {
            console.log(e);
            throw new Error('Error parsing property metadata');
        }
    }

    protected extractAndSetType(html: string): void {
        try {
            const $ = cheerio.load(html);
            const text = $(FactoryConstants.PROPERTY_TYPE_SELECTOR).text();
            const i = text.indexOf('hosted by');
            this.type = text.substring(0, i != -1 ? i : text.length).trim();
            console.log(this.type);
        } catch (e) {
            console.log(e);
            throw new Error('Error parsing property metadata');
        }
    }

    async scrapeProperty(): Promise<Property> {
        const html = await super.parseHTML(`${FactoryConstants.BASE_URL + this._propertyId}`);
        this.extractAndSetName(html);
        this.extractAndSetBedrooms(html);
        this.extractAndSetBathrooms(html);
        this.extractAndSetType(html);
        await this.extractAndSetAmenities(html);
        return this.getProperty();
    }
}