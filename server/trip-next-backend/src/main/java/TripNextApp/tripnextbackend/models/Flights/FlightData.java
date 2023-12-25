package TripNextApp.tripnextbackend.models.Flights;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FlightData {

    private List<FlightInfo> departureSegmentFlights = new ArrayList<>();
    private List<FlightInfo> returnSegmentFlights = new ArrayList<>();

    @JsonProperty
    private List<PurchaseLink> purchaseLinks = new ArrayList<>();

    public FlightData() {}

    public void setDepartureFlights(List<FlightInfo> departureFlights) {
        this.departureSegmentFlights = departureFlights;
    }

    public void setReturnFlights(List<FlightInfo> returnFlights) {
        this.returnSegmentFlights = returnFlights;
    }

    public List<FlightInfo> getDeparture() {
        return departureSegmentFlights;
    }

    public List<FlightInfo> getReturn() {
        return returnSegmentFlights;
    }

    public void setPurchaseLinks(List<PurchaseLink> purchaseLinks) {
        this.purchaseLinks = purchaseLinks;
    }

    public List<PurchaseLink> getPurchaseLinks() {
        return purchaseLinks;
    }
    
}
