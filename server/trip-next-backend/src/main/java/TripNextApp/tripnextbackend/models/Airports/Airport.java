package TripNextApp.tripnextbackend.models.Airports;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Airport {
    private String airportName;
    private String airportShortName;
    private String airportCode;
    private List<Airport> citiesAirportsList;

    public Airport(String name, String shortName, String AirportCode) {
        this.airportName = name;
        this.airportShortName = shortName;
        this.airportCode = AirportCode;
    }

    public String getName() {
        return airportName;
    }

    public String getAirportCode() {
        return airportCode;
    }

    public String getAirportShortName() {
        return airportShortName;
    }


    public void setName(String name) {
        this.airportName = name;
    }

    public void setAirportShortName(String airportShortName) {
        this.airportShortName = airportShortName;
    }

    public void setAirportCode(String airportCode) {
        this.airportCode = airportCode;
    }

    public List<Airport> getCitiesAirportsList() {
        return citiesAirportsList;
    }
    
    public void setCitiesAirportsList(List<Airport> citiesAirportsList) {
        this.citiesAirportsList = citiesAirportsList;
    }
}