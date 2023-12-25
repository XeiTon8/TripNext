package TripNextApp.tripnextbackend.services;

import org.springframework.stereotype.Service;

import TripNextApp.tripnextbackend.models.Flights.Flight;
import TripNextApp.tripnextbackend.models.Flights.FlightInfo;
import TripNextApp.tripnextbackend.models.Flights.FlightsParams;
import TripNextApp.tripnextbackend.models.Flights.PurchaseLink;
import TripNextApp.tripnextbackend.models.Flights.SearchFlightResponse;
import TripNextApp.tripnextbackend.models.Flights.FlightData;

import org.asynchttpclient.AsyncHttpClient;
import org.asynchttpclient.Dsl;
import org.asynchttpclient.Request;
import org.asynchttpclient.Response;
import org.asynchttpclient.Param;
import org.json.JSONArray;
import org.json.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.util.concurrent.CompletableFuture;
import java.util.List;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class FlightsService {
    private final String apiURL = "https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights";
    private final String apiKey = "";
    private static final Logger logger = LoggerFactory.getLogger(FlightsService.class);

    public CompletableFuture <String> getAllFlights(FlightsParams params) {
    AsyncHttpClient asyncHttpClient = Dsl.asyncHttpClient();

    Request request = asyncHttpClient.prepare("GET", apiURL)
    .addHeader("X-RapidAPI-Key", apiKey)
    .addHeader("X-RapidAPI-Host", "tripadvisor16.p.rapidapi.com")
    .addHeader("Accept", "application/json")
    .setQueryParams(paramsToQueryParams(params))
    .build();

    logRequestDetails(request);

    return asyncHttpClient.executeRequest(request)
    .toCompletableFuture()
    .thenApply(response -> parseFlightsResponse(response))
    .whenComplete((response, exception) -> {
        try {
            asyncHttpClient.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    });

    }

    private String parseFlightsResponse(Response response) {
        List<Flight> flights = new ArrayList<>();

        if (response.getStatusCode() == 200) {
            JSONObject jsonResponse = new JSONObject(response.getResponseBody());
            JSONObject data = jsonResponse.getJSONObject("data");
            JSONArray flightsArray = data.getJSONArray("flights");

            for (Object flightObject : flightsArray) {
                JSONObject flightArrayObject = (JSONObject) flightObject;
                JSONArray purchaseLinksArray = flightArrayObject.getJSONArray("purchaseLinks");
                List<PurchaseLink> linksToPurchase = new ArrayList<>();

                for (Object purchaseLinkObj : purchaseLinksArray) {
                    JSONObject purchaseLinkObject = (JSONObject) purchaseLinkObj;
                    String url = purchaseLinkObject.getString("url");
                    String currency = purchaseLinkObject.getString("currency");
                    int price = purchaseLinkObject.getInt("totalPrice");

                    if (purchaseLinkObject.has("partnerSuppliedProvider")) {
                    JSONObject partnerSuppliedProvider = purchaseLinkObject.getJSONObject("partnerSuppliedProvider");
                    String logoUrl = partnerSuppliedProvider.getString("logoUrl");
                    PurchaseLink linkForPushare = new PurchaseLink(url, price, currency, logoUrl);
                    linksToPurchase.add(linkForPushare);
                    } else {
                    PurchaseLink linkForPushare = new PurchaseLink(url, price, currency, null);
                    linksToPurchase.add(linkForPushare);
                    }
                }
                
                JSONArray segmentsArray = flightArrayObject.getJSONArray("segments");
                FlightData flightsData = parseSegments(segmentsArray, linksToPurchase);
                logger.info("Flight object data: {}", flightsData.toString());
                Flight flightToSend = new Flight(flightsData);
                flights.add(flightToSend);
            }
        }

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
        SearchFlightResponse res = new SearchFlightResponse(flights);

        try {
            return objectMapper.writeValueAsString(res);
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("Error: {}", res);
            return "{}"; 
        }
}

private FlightData parseSegments(JSONArray segmentsArray, List<PurchaseLink> purchaseLinksArray) {

    FlightData flightData = new FlightData();
    JSONObject firstObject = segmentsArray.getJSONObject(0);
    JSONObject secondObject = segmentsArray.getJSONObject(1);
    JSONArray firstObjectLegs = firstObject.getJSONArray("legs");
    JSONArray secondObjectLegs = secondObject.getJSONArray("legs");
    List<FlightInfo> firstLegFlights = new ArrayList<>();
    List<FlightInfo> secondLegFlights = new ArrayList<>();

    for (Object legObject : firstObjectLegs) {
        JSONObject firstLegObj = (JSONObject) legObject;
        JSONObject carrierObject = firstLegObj.getJSONObject("operatingCarrier");
            
            // Flight props
            String departureTime = firstLegObj.getString("departureDateTime");
            String arrivalTime = firstLegObj.getString("arrivalDateTime");
            String departureAirport = firstLegObj.getString("originStationCode");
            String arrivalAirport = firstLegObj.getString("destinationStationCode");
            String operatingCarrierName = carrierObject.getString("displayName");
            String operatingCarrierLogoUrl = carrierObject.getString("logoUrl");
            FlightInfo flight = new FlightInfo(departureAirport, arrivalAirport, departureTime, arrivalTime, operatingCarrierName, operatingCarrierLogoUrl);
            firstLegFlights.add(flight);
    }

    flightData.setDepartureFlights(firstLegFlights);

    for (Object legObject : secondObjectLegs) {
        JSONObject secondLegObj = (JSONObject) legObject;
        JSONObject carrierObject = secondLegObj.getJSONObject("operatingCarrier");
            
            // Flight props
            String departureTime = secondLegObj.getString("departureDateTime");
            String arrivalTime = secondLegObj.getString("arrivalDateTime");
            String departureAirport = secondLegObj.getString("originStationCode");
            String arrivalAirport = secondLegObj.getString("destinationStationCode");
            String operatingCarrierName = carrierObject.getString("displayName");
            String operatingCarrierLogoUrl = carrierObject.getString("logoUrl");
            logger.info("Arrival: {}", arrivalAirport);
            FlightInfo flight = new FlightInfo(departureAirport, arrivalAirport, departureTime, arrivalTime, operatingCarrierName, operatingCarrierLogoUrl);
            secondLegFlights.add(flight);        
        }
    flightData.setReturnFlights(secondLegFlights);

    flightData.setPurchaseLinks(purchaseLinksArray);
    return flightData;
}

    private void logRequestDetails(Request request) {
        logger.info("Request URL: {}", request.getUrl());
        logger.info("Request Method: {}", request.getMethod());
        logger.info("Request Headers: {}", request.getHeaders());
        logger.info("Request Query Parameters: {}", request.getQueryParams());
    }

    private List<Param> paramsToQueryParams(FlightsParams params) {
        List<Param> queryParams = new ArrayList<>();
        
        queryParams.add(new Param("sourceAirportCode", params.getSourceAirportCode()));
        queryParams.add(new Param("destinationAirportCode", params.getDestinationAirportCode()));
        queryParams.add(new Param("date", params.getDate()));
        
        params.getReturnDate().ifPresent(returnDate -> queryParams.add(new Param("returnDate", returnDate)));
        
        queryParams.add(new Param("itineraryType", params.getItineraryType()));
        queryParams.add(new Param("sortOrder", params.getSortOrder()));
        queryParams.add(new Param("numAdults", params.getNumAdults()));
        queryParams.add(new Param("numSeniors", params.getNumSeniors()));
        queryParams.add(new Param("classOfService", params.getClassOfService()));
        
        return queryParams;
    }
}
