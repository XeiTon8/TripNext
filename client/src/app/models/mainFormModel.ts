// Form
export enum itenaryType {
    oneWay = "ONE_WAY",
    roundTrip = "ROUND_TRIP" 
}

export enum sortOrder {
    mlBestValue = "ML_BEST_VALUE",
    duration = "DURATION",
    price = "PRICE",
    earliestOutboundDeparture = "EARLIEST_OUTBOUND_DEPARTURE",
    earliestOutboundArrival = "EARLIEST_OUTBOUND_ARRIVAL",
    latestOutboundDeparture = "LATEST_OUTBOUND_DEPRTURE",
    latestOutboundArrival = "LATEST_OUTBOUND_ARRIVAL"
}

export enum classOfService {
    economy = "ECONOMY",
    premiumEconomy = "PREMIUM_ECONOMY",
    business = "BUSINESS",
    first = "FIRST"
}

// API

export interface IFlightParams {
    sourceAirportCode: string | null;
    destinationAirportCode: string | null;
    date: string | null;
    returnDate?: string | null;
    itenaryType: itenaryType;
    sortOrder: sortOrder;
    numAdults: number | string | null;
    numSeniors: number | string | null;
    childAges?: number[] | string | null;
    classOfService: classOfService;
}

export interface SearchAirportAPIResponse {
    airportsList: IAirport[];
}

export interface SearchFlightsAPIResponse {
    flights: IFlightObject[];
}

// Rendering
export interface IAirport {
    name: string;
    airportShortName: string;
    airportCode: string;
    citiesAirportsList?: IAirport[];
}

export interface IFlightObject {
    flightDataObject: IFlightData,
    
}

export interface IFlightInfo {
    destinationStationCode: string | null;
    originStationCode: string | null;
    arrivalDateTime: string | Date | null;
    departureDateTime: string | Date | null;
    displayName: string | null;
    logoUrl: string | null;
    purchaseLink?: IPurchaseLink;
}

export interface IPurchaseLink {
    currency: string | null;
    totalPrice: number | null;
    url: string | null;
    logoUrl: string | null;
}

export interface IFlightData {
    departure: IFlightInfo[],
    return: IFlightInfo[],
    purchaseLinks: IPurchaseLink[],
}

export enum FlightDirectionType {
    cityToCity = "CITY-CITY",
    cityToAirport = "CITY-AIRPORT",
    airportToCity = "AIRPORT-CITY",
    airportToAirport = "AIRPORT-AIRPORT"

}