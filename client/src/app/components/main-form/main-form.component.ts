import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { FlightsService } from 'src/app/services/flights.service';
import { MainFormService } from 'src/app/services/main-form.service';
import { IFlightParams, classOfService, itenaryType, sortOrder, IAirport, SearchAirportAPIResponse, SearchFlightsAPIResponse, IFlightData, FlightDirectionType } from 'src/app/models/mainFormModel';
import { ITicketInfo } from 'src/app/models/flightCardModel';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss'],
})

export class MainFormComponent implements OnInit {

  constructor(private flightsService: FlightsService, private mainFormService: MainFormService, private datePipe: DatePipe) {}

  public math = Math;
  public isLoadingDone = false;
  private flightDirectionType: FlightDirectionType | null = null;

  public flightsToRender: SearchFlightsAPIResponse = { flights: [] };
  public selectedFlightData: IFlightData = { departure: [], return: [], purchaseLinks: [] }
  public flightStops: string[][] = [];

  public airportSuggestions: IAirport[] = []
  private departureCityAirports: IAirport[] = [];
  private destinationCityAirports: IAirport[] = [];
  

  // Form //
  public mainFormGroup = new FormGroup({

    departureAirport: new FormGroup({
      departureAirportName: new FormControl(""),
      departureAirportShortName: new FormControl(""),
      departureAirportCode: new FormControl(""),
    }),

    arrivalAirport: new FormGroup({
      arrivalAirportName: new FormControl(""),
      arrivalAirportShortName: new FormControl(""),
      arrivalAirportCode: new FormControl(""),
    }),

    departureDate: new FormControl<string | null>(""),
    arrivalDate: new FormControl<string | null>(""),
    isOneTrip: new FormControl(false),

    passengers: new FormGroup({
      adults: new FormControl(1),
      children: new FormControl<number [] | null>([]),
      seniors: new FormControl(0),
    }),

    flightServiceClass: new FormControl<classOfService | null>(classOfService.economy),
    itenaryType: new FormControl<itenaryType | null>(itenaryType.roundTrip),
    sortOrder: new FormControl<sortOrder | null>(sortOrder.mlBestValue),

  });

  public flightTicketInfo: ITicketInfo = {
    departureAirport: null,
    arrivalAirport: null,
    departureTime: null,
    arrivalTime: null,
    ticketType: null,
    flightServiceClass: null,
    passengers: [],
  }

  public formFlightServiceClass = classOfService;
  public formControlServiceClass = this.mainFormGroup.get("flightServiceClass")?.value;

  public mainPageStatus = {
    isDepartureAirportPopup: false,
    isArrivalAirportPopup: false,
    isPassengerPopup: false,
    isOneTrip: false,
    isAdditionalContent: false,
    isFlightsLoading: false,
    isDetailedFlightCard: false,
  }

  public mainFormState = {
    setOneTrip: (event: any) => {
      const target = event.target as HTMLInputElement;
      if (target.value) {
        this.mainPageStatus.isOneTrip = true;
        this.mainFormGroup.get("itenaryType")?.setValue(itenaryType.oneWay);
      }
    },
    setReturnTrip: (event: any) => {
      const target = event.target as HTMLInputElement;
      if (target.value) {
        this.mainPageStatus.isOneTrip = false;
        this.mainFormGroup.get("itenaryType")?.setValue(itenaryType.roundTrip);
      }
    },
    
    openAdditionalContent: () => { this.mainPageStatus.isAdditionalContent = true; },

    closeAdditionalContent: () => { this.mainPageStatus.isAdditionalContent = false; },

    closeFlightCard: (val: any) => { this.mainPageStatus.isDetailedFlightCard = val; },

    setSelectedFlight: (flight: IFlightData) => {
      this.setFlightTicketInfo();
      this.selectedFlightData = flight;
      this.mainPageStatus.isDetailedFlightCard = true;
    },

    passengersState: {
      addAdult: () => {
        const currentAdults = this.mainFormGroup.get("passengers.adults")?.value;
        if (currentAdults !== null && currentAdults !== undefined) {
          this.mainFormGroup.get("passengers.adults")?.setValue(currentAdults + 1);
        }
      },

      removeAdult: () => {
        const currentAdults = this.mainFormGroup.get("passengers.adults")?.value;
        if (currentAdults !== null && currentAdults !== undefined) {
          this.mainFormGroup.get("passengers.adults")?.setValue(currentAdults - 1);
        }
      },

      addSenior: () => {
        const currentSeniors = this.mainFormGroup.get("passengers.seniors")?.value;
        if (currentSeniors !== null && currentSeniors !== undefined) {
          this.mainFormGroup.get("passengers.seniors")?.setValue(currentSeniors + 1);
        }
      },

      removeSenior: () => {
        const currentSeniors = this.mainFormGroup.get("passengers.seniors")?.value;
        if (currentSeniors !== null && currentSeniors !== undefined) {
          this.mainFormGroup.get("passengers.seniors")?.setValue(currentSeniors - 1);
        }
      },

      addChildren: () => {
        const currentChildren = this.mainFormGroup.get("passengers.children")?.value;
        if (currentChildren !== null && currentChildren !== undefined) {
        currentChildren.push(1);
        }
      },

      removeChildren: () => {
        const currentChildren = this.mainFormGroup.get("passengers.children")?.value;
        if (currentChildren !== null && currentChildren !== undefined) {
        currentChildren.pop();
        }
      },
    },
  }

  public numOfPassengers = {
    numOfAdults: () => { return this.mainFormGroup.get("passengers.adults")?.value || 0; },
    numOfSeniors: () => { return this.mainFormGroup.get("passengers.seniors")?.value || 0; },
    numOfChildren: () => { const childrenArray = this.mainFormGroup.get("passengers.children")?.value; return childrenArray ? childrenArray.length : 0; }
  }

  public getMinPrice(flight: IFlightData) {
    const pricesArray = flight.purchaseLinks.map((price) => price.totalPrice!);
    return this.math.min(...pricesArray);
  }

  // Setters
  public setDepartureAirport(e: Event) {
    const target = (e.target) as HTMLInputElement;
    this.mainFormService.setDepartureAirport(this.mainFormGroup, this.mainPageStatus, target.value);
  }

  public setArrivalAirport(e: Event) {
    const target = (e.target) as HTMLInputElement;
    this.mainFormService.setArrivalAirport(this.mainFormGroup, this.mainPageStatus, target.value);
  }

  public setSuggestedAirport(event: any) {
    this.mainFormService.setSuggestedAirport(this.mainFormGroup, this.mainPageStatus, this.airportSuggestions, this.departureCityAirports, this.destinationCityAirports, event);
    this.airportSuggestions = [];
    console.log(this.airportSuggestions);
  }

  public setDepartureDate(event: any) {
  const target = event.target as HTMLInputElement;
  if (target.value) {
    this.mainFormService.setDepartureDate(this.mainFormGroup, target.value)
  }
}

  public setArrivalDate(event: any) {
    const target = event.target as HTMLInputElement;
    if (target.value) {
    this.mainFormService.setArrivalDate(this.mainFormGroup, target.value)
    }
  }

  public setFlightTicketInfo() {
    this.flightTicketInfo = {
      departureAirport: this.mainFormGroup.get("departureAirport.departureAirportCode")!?.value,
      arrivalAirport: this.mainFormGroup.get("arrivalAirport.arrivalAirportCode")!?.value,
      departureTime: this.mainFormGroup.get("departureDate")!?.value,
      arrivalTime: this.mainFormGroup.get("arrivalDate")!?.value,
      ticketType: this.mainFormGroup.get("itenaryType")!?.value,
      flightServiceClass: this.mainFormGroup.get("flightServiceClass")!?.value,
      passengers: this.calculatePassengers(),
    }
  }

  public setFlightDirectionType() {
    if (this.departureCityAirports.length >= 1 && this.destinationCityAirports.length == 0) {
      this.flightDirectionType = FlightDirectionType.cityToAirport;
    } else if (this.departureCityAirports.length == 0 && this.destinationCityAirports.length >= 1) {
      this.flightDirectionType = FlightDirectionType.airportToCity;
    } else if (this.departureCityAirports.length == 0 && this.destinationCityAirports.length == 0) {
      this.flightDirectionType = FlightDirectionType.airportToAirport;
    } else if (this.departureCityAirports.length >= 1 && this.destinationCityAirports.length >= 1) {
      this.flightDirectionType = FlightDirectionType.cityToCity;
    }
  }
  
  // Airports
  public sendRequest(value: string) {
    this.flightsService.getAirports(value).subscribe((res: SearchAirportAPIResponse) => {
      console.log(res);
      this.airportSuggestions = res.airportsList;
    });
    console.log(this.airportSuggestions)
    return this.airportSuggestions;
  }

  public searchAirports(event: any) {
    const query = event.query.toLowerCase();
    this.airportSuggestions = this.airportSuggestions.filter((airport) =>
      airport.name.toLowerCase().includes(query)
    );
  }

  // Flights
  public searchFlights() {
    this.flightsToRender = { flights: [] };
    this.flightStops = [];

    const paramsToSend: IFlightParams = {
      sourceAirportCode: this.mainFormGroup.get("departureAirport.departureAirportCode")?.value!,
      destinationAirportCode: this.mainFormGroup.get("arrivalAirport.arrivalAirportCode")?.value!,
      date: this.mainFormGroup.get("departureDate")?.value!,
      returnDate: this.mainFormGroup.get("arrivalDate")?.value!,
      itenaryType: this.mainFormGroup.get("itenaryType")?.value!,
      sortOrder: this.mainFormGroup.get("sortOrder")?.value!,
      numAdults: this.mainFormGroup.get("passengers.adults")?.value!,
      numSeniors: this.mainFormGroup.get("passengers.seniors")?.value!,
      classOfService: this.mainFormGroup.get("flightServiceClass")?.value!
    }

    this.mainPageStatus.isFlightsLoading = true;

    this.flightsService.getFlights(paramsToSend).subscribe((val: SearchFlightsAPIResponse) => {
      console.log(val);
      this.setFlightDirectionType();
      this.flightsToRender = val;
      this.setFlightStops();
      this.mainPageStatus.isFlightsLoading = false;
      console.log(this.flightsToRender);
      this.isLoadingDone = true;
    })
  }

  public setFlightStops() {
    const stopsToAdd: string[][] = [];
    let stops = new Set<string>();

    let departureAirport = this.mainFormGroup.get("departureAirport.departureAirportCode")?.value;
    let finalDestination = this.mainFormGroup.get("arrivalAirport.arrivalAirportCode")?.value;

    const departureAirportCodes = this.departureCityAirports.map((airport) => airport.airportCode);
    const destinationAirportCodes = this.destinationCityAirports.map((airport) => airport.airportCode);
    const citiesAirports = [...departureAirportCodes, ...destinationAirportCodes];

    for (const flightObject of this.flightsToRender.flights) {
        const flightDataObject = flightObject.flightDataObject;
        let airportCodes = new Set<string>();

        if (this.flightDirectionType == FlightDirectionType.airportToAirport) {

          // Departure arr
          const destinationDeparture = flightDataObject.departure[0].destinationStationCode;
          destinationDeparture !== finalDestination ? stops.add(destinationDeparture!) : null;
          if (flightDataObject.departure.length > 1) {
            let codesArr: string[] = [];
            let codesSet = new Set<string>();
            codesArr.push(departureAirport!, finalDestination!);

            for (let i = 1; i < flightDataObject.departure.length; i++) {
              let origin = flightDataObject.departure[i].originStationCode;
              let departure = flightDataObject.departure[i].destinationStationCode;
              codesSet.add(origin!);
              codesSet.add(departure!);
            }

            codesSet.forEach((code) => !codesArr.includes(code) ? stops.add(code!) : null);
          }

          // Return arr
          const returnDeparture = flightDataObject.return[flightDataObject.return.length - 1].destinationStationCode;
          returnDeparture !== departureAirport ? stops.add(returnDeparture!) : null;
          if (flightDataObject.return.length > 1) {
            let codesArr: string[] = [];
            codesArr.push(departureAirport!, finalDestination!);

            for (let i = 1; i < flightDataObject.return.length; i++) {
              let origin = flightDataObject.return[i].originStationCode;
              let departure = flightDataObject.return[i].destinationStationCode;
              airportCodes.add(origin!);
              airportCodes.add(departure!);
              airportCodes.forEach((code) => !codesArr.includes(code) ? stops.add(code!) : null);
            }
          }
        } else if (this.flightDirectionType == FlightDirectionType.cityToAirport 
          || this.flightDirectionType == FlightDirectionType.cityToCity 
          || this.flightDirectionType == FlightDirectionType.airportToCity) {

          for (let i = 0; i < flightDataObject.departure.length; i++) {
            const departureAirport = flightDataObject.departure[i].originStationCode;
            const arrivalAirport = flightDataObject.departure[i].destinationStationCode;
            airportCodes.add(departureAirport!);
            airportCodes.add(arrivalAirport!);
          }
          
          airportCodes.forEach((code) => !citiesAirports.includes(code) ? stops.add(code) : null);

          for (let i = 0; i < flightDataObject.return.length; i++) {
            const departureAirport = flightDataObject.return[i].originStationCode;
            const arrivalAirport = flightDataObject.return[i].destinationStationCode;
            airportCodes.add(departureAirport!);
            airportCodes.add(arrivalAirport!);
          }
          
          airportCodes.forEach((code) => !citiesAirports.includes(code) ? stops.add(code) : null);
        } 
          stopsToAdd.push(Array.from(stops));
          stops.clear();
      }
  this.flightStops = stopsToAdd;
  console.log(this.flightStops);
}

public calculatePassengers() {
  const numArray: number[] = [];
  const adults = this.mainFormGroup.get("passengers.adults")?.value;
  const seniors = this.mainFormGroup.get("passengers.seniors")?.value;
  const childrenArr = this.mainFormGroup.get("passengers.children")?.value;

  if (childrenArr !== null && childrenArr !== undefined && childrenArr?.length > 0) {
    childrenArr?.forEach((child) => {
      numArray.push(child);
    })
  }
  adults !== undefined && adults !== null && adults !== 0 ?  numArray.push(adults) : null;
  seniors !== undefined && seniors !== null && seniors !== 0 ? numArray.push(seniors) : null;
  return numArray;
}

ngOnInit(): void {

  this.mainFormGroup.get("departureAirport")?.valueChanges.pipe(
  debounceTime(500),
  ).subscribe((val: any | null) => {
  this.sendRequest(val.departureAirportName!)
  console.log("Response: ", this.airportSuggestions); 
})

this.mainFormGroup.get("arrivalAirport")?.valueChanges.pipe(
  debounceTime(500),
  ).subscribe((val: any | null) => {
  this.sendRequest(val.arrivalAirportName!)
  console.log("Response: ", this.airportSuggestions); 
})

  }

}