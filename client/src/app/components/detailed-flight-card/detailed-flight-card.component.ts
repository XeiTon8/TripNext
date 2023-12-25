import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ITicketInfo } from 'src/app/models/flightCardModel';
import { IFlightData, IFlightInfo, IFlightObject } from 'src/app/models/mainFormModel';

@Component({
  selector: 'app-detailed-flight-card',
  templateUrl: './detailed-flight-card.component.html',
  styleUrls: ['./detailed-flight-card.component.scss']
})
export class DetailedFlightCardComponent implements OnInit {
  
@Input() flightObject: IFlightData = {
    departure: [],
    return: [],
    purchaseLinks: [],
}

@Input() flightTicketInfo: ITicketInfo = {
  departureAirport: "",
  arrivalAirport: "",
  departureTime: "",
  arrivalTime: "",
  passengers: [],
  ticketType: null,
  flightServiceClass: null,
}

@Output() isOpenedCard = new EventEmitter<boolean>();

public closeCard() { this.isOpenedCard.emit(false); }

ngOnInit(): void {
  console.log(this.flightObject);
}

}
