package TripNextApp.tripnextbackend.controllers;

import TripNextApp.tripnextbackend.models.Flights.FlightInfo;
import TripNextApp.tripnextbackend.models.Flights.FlightsParams;
import TripNextApp.tripnextbackend.models.Flights.SearchFlightResponse;
import TripNextApp.tripnextbackend.services.FlightsService;
import TripNextApp.tripnextbackend.models.Flights.Flight;

import java.util.concurrent.CompletableFuture;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/flights")
public class FlightController {

    @Autowired
    private FlightsService flightService;

    @GetMapping("/getFlights")
    public CompletableFuture <String> getAllFlights(
        @RequestParam("sourceAirportCode") String sourceAirportCode,
        @RequestParam("destinationAirportCode") String destinationAirportCode,
        @RequestParam("date") String date,
        @RequestParam(value = "returnDate", required = false) String returnDate,
        @RequestParam("itineraryType") String itineraryType,
        @RequestParam("sortOrder") String sortOrder,
        @RequestParam("numAdults") String numAdults,
        @RequestParam("numSeniors") String numSeniors,
        @RequestParam("classOfService") String classOfService
    ) {
        FlightsParams params = new FlightsParams();
        params.setSourceAirportCode(sourceAirportCode);
        params.setDestinationAirportCode(destinationAirportCode);
        params.setDate(date);
        params.setReturnDate(Optional.ofNullable(returnDate));
        params.setItineraryType(itineraryType);
        params.setSortOrder(sortOrder);
        params.setNumAdults(numAdults);
        params.setNumSeniors(numSeniors);
        params.setClassOfService(classOfService);
        return this.flightService.getAllFlights(params);
    }
    
}
