import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFlightParams, SearchAirportAPIResponse, SearchFlightsAPIResponse } from '../models/mainFormModel';

@Injectable({
  providedIn: 'root'
})
export class FlightsService {

  private url = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  public getAirports(query: string): Observable<SearchAirportAPIResponse> {
    const params = new HttpParams().set('query', query)
    return this.http.get<SearchAirportAPIResponse>(`${this.url}/airports/fetchAirports`, {params});
  }

  public getFlights(params: IFlightParams): Observable<SearchFlightsAPIResponse> {
    let queryParams = new HttpParams()
    .set('sourceAirportCode', params.sourceAirportCode!)
    .set('destinationAirportCode', params.destinationAirportCode!)
    .set('date', params.date!)
    .set('itineraryType', params.itenaryType)
    .set('sortOrder', params.sortOrder)
    .set('numAdults', params.numAdults!)
    .set('numSeniors', params.numSeniors!)
    .set('classOfService', params.classOfService);

  if (params.returnDate) {
    queryParams = queryParams.set('returnDate', params.returnDate);
  }

  console.log(queryParams);
    return this.http.get<SearchFlightsAPIResponse>(`${this.url}/flights/getFlights`, {params: queryParams})
  }
}
