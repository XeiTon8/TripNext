package TripNextApp.tripnextbackend.models.Flights;
import com.fasterxml.jackson.annotation.JsonProperty;

import TripNextApp.tripnextbackend.models.Flights.PurchaseLink;

import com.fasterxml.jackson.annotation.JsonInclude;
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FlightInfo {

    @JsonProperty("originStationCode")
    String departureAirport;
    @JsonProperty("destinationStationCode")
    String arrivalAirport;
    @JsonProperty("departureDateTime")
    String departureAirportDateTime;
    @JsonProperty("arrivalDateTime")
    String arrivalAirportDateTime;
    @JsonProperty("displayName")
    String operatingCarrierName;
    @JsonProperty("logoUrl")
    String operatingCarrierLogoUrl;

    public FlightInfo(
        String departureAirport, 
        String arrivalAirport, 
        String departureAirportDateTime, 
        String arrivalAirportDateTime, 
        String operatingCarrierName, 
        String operatingCarrierLogoUrl
    )
    {
        this.departureAirport = departureAirport;
        this.arrivalAirport = arrivalAirport;
        this.departureAirportDateTime = departureAirportDateTime;
        this.arrivalAirportDateTime = arrivalAirportDateTime;
        this.operatingCarrierName = operatingCarrierName;
        this.operatingCarrierLogoUrl = operatingCarrierLogoUrl;
            
    }

    public String getDepartureAirport() {
        return departureAirport;
    }

    public void setDepartureAirport(String departureAirport) {
        this.departureAirport = departureAirport;
    }

    public String getArrivalAirport() {
        return arrivalAirport;
    }

    public void setArrivalAirport(String arrivalAirport) {
        this.arrivalAirport = arrivalAirport;
    }

    public String getDepartureAirportDateTime() {
        return departureAirportDateTime;
    }

    public void setDepartureAirportDateTime(String departureAirportDateTime) {
        this.departureAirportDateTime = departureAirportDateTime;
    }

    public String getArrivalAirportDateTime() {
        return arrivalAirportDateTime;
    }

    public void setArrivalAirportDateTime(String arrivalAirportDateTime) {
        this.arrivalAirportDateTime = arrivalAirportDateTime;
    }

    public String getOperatingCarrierName() {
        return operatingCarrierName;
    }

    public void setOperatingCarrierName(String operatingCarrierName) {
        this.operatingCarrierName = operatingCarrierName;
    }

    public String getOperatingCarrierLogoUrl() {
        return operatingCarrierLogoUrl;
    }

    public void setOperatingCarrierLogoUrl(String operatingCarrierLogoUrl) {
        this.operatingCarrierLogoUrl = operatingCarrierLogoUrl;
    }
}