package TripNextApp.tripnextbackend.controllers;

import TripNextApp.tripnextbackend.models.Airports.Airport;
import TripNextApp.tripnextbackend.models.Airports.SearchAirportResponse;
import TripNextApp.tripnextbackend.services.AirtportService;

import java.util.List;
import java.util.concurrent.CompletableFuture;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/airports")
public class AirportController {

    @Autowired
    private AirtportService airtportService;

@GetMapping("/fetchAirports")
public CompletableFuture<SearchAirportResponse> getAirports(String query) {
    return airtportService.getAllAirports(query);
}
    
}
