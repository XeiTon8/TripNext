package TripNextApp.tripnextbackend.models.Flights;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PurchaseLink {
    @JsonProperty("url")
    String pushareLinkURL;
    @JsonProperty("totalPrice")
    int pushareLinkPrice;
    @JsonProperty("currency")
    String currency;
    @JsonProperty("logoUrl")
    String logoUrl;

    public PurchaseLink(String pushareLinkUrl, int pushareLinkPrice, String currency, String logoUrl) {
        this.pushareLinkURL = pushareLinkUrl;
        this.pushareLinkPrice = pushareLinkPrice;
        this.currency = currency;
        this.logoUrl = logoUrl;
    }
}
