package TripNextApp.tripnextbackend.models.Flights;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SearchFlightResponse {
    
    @JsonProperty
    private List<Flight> flights = new ArrayList<>();

    public SearchFlightResponse(List<Flight> Flights) {
        this.flights = Flights;
    }
}
