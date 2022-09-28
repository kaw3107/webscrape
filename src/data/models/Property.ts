export interface Property {
    name: string,
    type: string,
    bedrooms: number,
    bathrooms: number,
    amenities: Amenities[]
}

export interface Amenities {
    group: string
    amenity: string[]
}