package TripNextApp.tripnextbackend.models.Flights;

import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class Flight {
    @JsonProperty
    private FlightData flightDataObject;

    public Flight(FlightData flightData) {
        this.flightDataObject = flightData;
    }
}
