const chromium = require('@sparticuz/chrome-aws-lambda');
import {Amenities, Property} from '../../data/models/Property';
import {Page} from 'puppeteer-core';

export abstract class PropertyScraper implements Property {
    private _currentPage: Page;

    amenities: Array<Amenities>;
    bathrooms: number;
    bedrooms: number;
    name: string;
    type: string;

    protected get currentPage(): Page{
        return this._currentPage
    }

    protected set currentPage(page: Page){
        this._currentPage = page
    }

    private async gotoPage(url: string){
        const browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        this.currentPage = await browser.newPage();
        await this.currentPage.goto(url, {waitUntil: 'networkidle0'})
    }

    public async parseHTML(url: string): Promise<string> {
        try{
            await this.gotoPage(url);
            return await this.currentPage.evaluate(() =>  document.documentElement.outerHTML);
        } catch (e){
            console.log(e);
            throw new Error("Error parsing HTML")
        }
    }

    public getProperty(): Property {
        return {
            type: this.type,
            amenities: this.amenities,
            bathrooms: this.bathrooms,
            name: this.name,
            bedrooms: this.bedrooms
        }
    }
    public abstract scrapeProperty(): Promise<Property>
    protected abstract extractAndSetType(html: string):void
    protected abstract extractAndSetName(html: string): void
    protected abstract extractAndSetBedrooms(html: string): void
    protected abstract extractAndSetBathrooms(html: string): void
    protected abstract extractAndSetAmenities(html: string): void
}
