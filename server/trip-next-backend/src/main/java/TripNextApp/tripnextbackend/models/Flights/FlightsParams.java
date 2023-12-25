package TripNextApp.tripnextbackend.models.Flights;
import java.util.Optional;

public class FlightsParams {
    private String sourceAirportCode;
    private String destinationAirportCode;
    private String date;
    private Optional<String> returnDate;
    private String itineraryType;
    private String sortOrder;
    private String numAdults;
    private String numSeniors;
    private String classOfService;

    public String getSourceAirportCode() {
        return sourceAirportCode;
    }

    public void setSourceAirportCode(String sourceAirportCode) {
        this.sourceAirportCode = sourceAirportCode;
    }

    public String getDestinationAirportCode() {
        return destinationAirportCode;
    }

    public void setDestinationAirportCode(String destinationAirportCode) {
        this.destinationAirportCode = destinationAirportCode;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Optional<String> getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(Optional<String> returnDate) {
        this.returnDate = returnDate;
    }

    public String getItineraryType() {
        return itineraryType;
    }

    public void setItineraryType(String itineraryType) {
        this.itineraryType = itineraryType;
    }

    public String getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getNumAdults() {
        return numAdults;
    }

    public void setNumAdults(String numAdults) {
        this.numAdults = numAdults;
    }

    public String getNumSeniors() {
        return numSeniors;
    }

    public void setNumSeniors(String numSeniors) {
        this.numSeniors = numSeniors;
    }

    public String getClassOfService() {
        return classOfService;
    }

    public void setClassOfService(String classOfService) {
        this.classOfService = classOfService;
    }
    
}
