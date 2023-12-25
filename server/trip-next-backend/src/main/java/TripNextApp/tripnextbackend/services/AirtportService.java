package TripNextApp.tripnextbackend.services;

import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.CompletableFuture;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import org.asynchttpclient.AsyncHttpClient;
import org.asynchttpclient.Dsl;
import org.asynchttpclient.Response;

import org.springframework.stereotype.Service;

import TripNextApp.tripnextbackend.models.Airports.Airport;
import TripNextApp.tripnextbackend.models.Airports.SearchAirportResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class AirtportService {


    private final String apiUrl = "https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchAirport";
    private final String apiKey = "11cd950130msh965a47f9b1587c7p11272ajsn329e68cecee2";
    private static final Logger logger = LoggerFactory.getLogger(AirtportService.class);


    public CompletableFuture<SearchAirportResponse> getAllAirports(String query) {
        AsyncHttpClient asyncHttpClient = Dsl.asyncHttpClient();

        return asyncHttpClient
                .prepare("GET", apiUrl)
                .setHeader("X-RapidAPI-Key", apiKey)
                .setHeader("X-RapidAPI-Host", "tripadvisor16.p.rapidapi.com")
                .addQueryParam("query", query)
                .execute()
                .toCompletableFuture()
                .thenApply(response -> parseResponse(response))
                .whenComplete((response, exception) -> {
                    try {
                        asyncHttpClient.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });
    }
    
    private SearchAirportResponse parseResponse(Response response) {
        List<Airport> airports = new ArrayList();
        List<Airport> childrenArray = new  ArrayList<>();
        

        if (response.getStatusCode() == 200) {
            String responseBody = response.getResponseBody();
            logger.info("Received JSON response: {}", responseBody); 
            JSONObject jsonResponse = new JSONObject(response.getResponseBody());
            JSONArray dataArray = jsonResponse.getJSONArray("data");

            for (Object dataObject : dataArray) {
                JSONObject jsonObject = (JSONObject) dataObject; 

                if (jsonObject.has("children")) {
                
                JSONArray childrenArrayJson = jsonObject.getJSONArray("children");

                for (Object childrenObject : childrenArrayJson) {
                JSONObject childrenObj = (JSONObject) childrenObject;
                String name = childrenObj.getString("name");
                String shortName = childrenObj.getString("shortName");
                String airportCode = childrenObj.getString("airportCode");

                Airport childrenAirport = new Airport(name, shortName, airportCode);
                childrenArray.add(childrenAirport);
                }
            }
                try {
                String name = jsonObject.getString("name");
                String shortName = jsonObject.getString("shortName");
                String airportCode = jsonObject.getString("airportCode");
                Airport airport = new Airport(name, shortName, airportCode);
                if (childrenArray.size() > 0) {
                    airport.setCitiesAirportsList(childrenArray);
                }
                airports.add(airport);
                } catch (JSONException e) {
                    logger.error("Error processing JSON entry: {}", e.getMessage());
                }

            }
        }
        SearchAirportResponse apiResponse = new SearchAirportResponse(airports);
        return apiResponse;
    }
}
