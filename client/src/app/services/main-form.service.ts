import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IAirport } from '../models/mainFormModel';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MainFormService {

  constructor(private datePipe: DatePipe) { }

  public setDepartureAirport(mainFormGroup: FormGroup, mainPageStatus: any, value: string) {
    mainFormGroup.get("departureAirport.departureAirportName")?.setValue(value);
    const formControlValue = mainFormGroup.get("departureAirport.departureAirportName")?.value
    if (formControlValue!?.length >= 3) {
      mainPageStatus.isDepartureAirportPopup = true;
    }
  }

  public setArrivalAirport(mainFormGroup: FormGroup, mainPageStatus: any, value: string) {
    mainFormGroup.get("arrivalAirport.arrivalAirportName")?.setValue(value);
    const arrivalFormControlValue = mainFormGroup.get("arrivalAirport.arrivalAirportName")?.value;
    if (arrivalFormControlValue!?.length >= 3) {
      mainPageStatus.isArrivalAirportPopup = true;
    }
  }

  public setDepartureDate(mainFormGroup: FormGroup, value: string) {
    const selectedDate = new Date(value);
    const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
    mainFormGroup.get("departureDate")?.setValue(formattedDate);
    console.log(mainFormGroup.get("departureDate")?.value)
  }

  public setArrivalDate(mainFormGroup: any, value: string) {
    const selectedDate = new Date(value);
    const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
    mainFormGroup.get("arrivalDate")?.setValue(formattedDate);
    console.log(mainFormGroup.get("arrivalDate")?.value)
  }

  public setSuggestedAirport(
    mainFormGroup: FormGroup, 
    mainPageStatus: any, 
    airportSuggestions: IAirport[],
    departureCityAirports: IAirport[],
    destinationCityAirports: IAirport[], 
    event: string) {
      console.log(destinationCityAirports);
    if (mainPageStatus.isDepartureAirportPopup) {
      const airportToSet = airportSuggestions.find((airport) => airport.name === event);
      if (airportToSet) {
        console.log(airportToSet);
        mainFormGroup.get("departureAirport")?.patchValue({
          departureAirportName: event,
          departureAirportShortName: airportToSet.airportShortName,
          departureAirportCode: airportToSet.airportCode
        })
        console.log(airportToSet);
        if (airportToSet.citiesAirportsList && airportToSet.citiesAirportsList.length > 0) {
          departureCityAirports = airportToSet.citiesAirportsList;
        }
        this.checkCityAirport(destinationCityAirports, departureCityAirports, mainFormGroup);
        mainPageStatus.isDepartureAirportPopup = false;
        
      }
    } else if (mainPageStatus.isArrivalAirportPopup) {
      const airportToSet = airportSuggestions.find((airport) => airport.name === event);
      if (airportToSet) {
        console.log(airportToSet);
        mainFormGroup.get("arrivalAirport")?.patchValue({
          arrivalAirportName: event,
          arrivalAirportShortName: airportToSet.airportShortName,
          arrivalAirportCode: airportToSet.airportCode
        })
        if (airportToSet.citiesAirportsList && airportToSet.citiesAirportsList.length > 0) {
          destinationCityAirports = airportToSet.citiesAirportsList;
        }
        this.checkCityAirport(destinationCityAirports, departureCityAirports, mainFormGroup);
        mainPageStatus.isArrivalAirportPopup = false;
      }}  
  }

  public checkCityAirport(destinationCityAirports: any[], departureCityAirports: any[], mainFormGroup: any) {
    if (destinationCityAirports.length == 1) {
      const nameToCheck = mainFormGroup.get("arrivalAirport.arrivalAirportName")?.value;
      const shortNameToCheck = mainFormGroup.get("arrivalAirport.arrivalAirportShortName")?.value;
      if (nameToCheck && shortNameToCheck) {
        const finalAirportNameToCheck = nameToCheck.split(" ").concat(shortNameToCheck.split(" "));
        for (let i = 0; i < finalAirportNameToCheck.length; i++) {
          if (destinationCityAirports[0].name.includes(finalAirportNameToCheck[i])) {
            mainFormGroup.get("arrivalAirport.arrivalAirportCode")?.setValue(destinationCityAirports[0].airportCode);
            break;
          }}
      }} else if (departureCityAirports.length == 1) {
        const nameToCheck = mainFormGroup.get("departureAirport.departureAirportName")?.value;
        const shortNameToCheck = mainFormGroup.get("departureAirport.departureAirportShortName")?.value;
        if (nameToCheck && shortNameToCheck) {
          const finalAirportNameToCheck = nameToCheck.split(" ").concat(shortNameToCheck.split(" "));
          for (let i = 0; i < finalAirportNameToCheck.length; i++) {
            if (departureCityAirports[0].name.includes(finalAirportNameToCheck[i])) {
              mainFormGroup.get("departureAirport.departureAirportCode")?.setValue(departureCityAirports[0].airportCode);
              break;
            }}}
      } else {
        return;
      }
  }


}
