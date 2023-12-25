package TripNextApp.tripnextbackend.models.Airports;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import TripNextApp.tripnextbackend.models.Airports.Airport;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SearchAirportResponse {

private List<Airport> airportsList = new ArrayList<>();


public SearchAirportResponse(List<Airport> airportsList) {
    this.airportsList = airportsList;
}

public List<Airport> getAirportsList() {
    return airportsList;
}

public void setAirportsList(List<Airport> airportsList) {
    this.airportsList = airportsList;
}
    
}
