import { classOfService, itenaryType } from "./mainFormModel";

export interface ITicketInfo {
    departureAirport: string | null,
    arrivalAirport: string | null,
    departureTime: string | null,
    arrivalTime: string | null,
    ticketType: itenaryType | null,
    flightServiceClass: classOfService | null,
    passengers: number[] | null
}
