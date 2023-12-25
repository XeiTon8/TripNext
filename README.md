# 📜 TripNext
![TripNext-gif](https://github.com/XeiTon8/TripNext/blob/main/TripNext-Gif.gif)
A simple application that allows user to search for flight tickets. 

**Details about app logic**:

1. User can choose a departure and destination. From backend, I receive either a city or an airport. Each city (e.g. "LON" which stands for London) has a nested array with city airports ("children"). Airports don't have this nested array. If "children" array was found, it'd be saved to a local variable in a component's class.

2. After user has launched flight tickets searching, I set travel type (e.g. city to airport, airport to city, or other variations), receive flights list from the backend and start defining flight stops.

3. Method for defining flight stops iterates through the whole received flights array and checks each of its flights' segments (departure and return). 

If there's any unique airport code (e.g. it's **not** similar to final destination or not from array with airport cities codes), this code will be added into the stops array. 

Code snippet with logic and commentaries:
```
  public setFlightStops() {
    // Stops that'll be saved into stops array in a component. Each nested array inside stops array represents stops for one flight.
    const stopsToAdd: string[][] = [];
    // Set that'll be converted into the array later
    let stops = new Set<string>();

    let departureAirport = this.mainFormGroup.get("departureAirport.departureAirportCode")?.value;
    let finalDestination = this.mainFormGroup.get("arrivalAirport.arrivalAirportCode")?.value;

    const departureAirportCodes = this.departureCityAirports.map((airport) => airport.airportCode);
    const destinationAirportCodes = this.destinationCityAirports.map((airport) => airport.airportCode);
    const citiesAirports = [...departureAirportCodes, ...destinationAirportCodes];

    for (const flightObject of this.flightsToRender.flights) {
        const flightDataObject = flightObject.flightDataObject;
        // Airport codes that'll include each airport code from departure or return segment
        let airportCodes = new Set<string>();

        if (this.flightDirectionType == FlightDirectionType.airportToAirport) {

          // Departure arr
          const destinationDeparture = flightDataObject.departure[0].destinationStationCode;
          destinationDeparture !== finalDestination ? stops.add(destinationDeparture!) : null;
          if (flightDataObject.departure.length > 1) {
            let codesArr: string[] = [];
            let codesSet = new Set<string>();
            codesArr.push(departureAirport!, finalDestination!);
           
            for (let i = 1; i < flightDataObject.departure.length; i++) {
              let origin = flightDataObject.departure[i].originStationCode;
              let departure = flightDataObject.departure[i].destinationStationCode;
              codesSet.add(origin!);
              codesSet.add(departure!);
            }
             codesSet.forEach((code) => !codesArr.includes(code) ? stops.add(code!) : null);
          }

          // Return arr
          const returnDeparture = flightDataObject.return[flightDataObject.return.length - 1].destinationStationCode;
          returnDeparture !== departureAirport ? stops.add(returnDeparture!) : null;
          if (flightDataObject.return.length > 1) {
            let codesArr: string[] = [];
            codesArr.push(departureAirport!, finalDestination!);

            for (let i = 1; i < flightDataObject.return.length; i++) {
              let origin = flightDataObject.return[i].originStationCode;
              let departure = flightDataObject.return[i].destinationStationCode;
              airportCodes.add(origin!);
              airportCodes.add(departure!);
              airportCodes.forEach((code) => !codesArr.includes(code) ? stops.add(code!) : null);
            }
          }
        } else if (this.flightDirectionType == FlightDirectionType.cityToAirport 
          || this.flightDirectionType == FlightDirectionType.cityToCity 
          || this.flightDirectionType == FlightDirectionType.airportToCity) {

          for (let i = 0; i < flightDataObject.departure.length; i++) {
            const departureAirport = flightDataObject.departure[i].originStationCode;
            const arrivalAirport = flightDataObject.departure[i].destinationStationCode;
            airportCodes.add(departureAirport!);
            airportCodes.add(arrivalAirport!);
          }
          
          airportCodes.forEach((code) => !citiesAirports.includes(code) ? stops.add(code) : null);

          for (let i = 0; i < flightDataObject.return.length; i++) {
            const departureAirport = flightDataObject.return[i].originStationCode;
            const arrivalAirport = flightDataObject.return[i].destinationStationCode;
            airportCodes.add(departureAirport!);
            airportCodes.add(arrivalAirport!);
          }
          
          airportCodes.forEach((code) => !citiesAirports.includes(code) ? stops.add(code) : null);
        } 
          stopsToAdd.push(Array.from(stops));
          stops.clear();
      }
  this.flightStops = stopsToAdd;
  console.log(this.flightStops);
}
```

## 🚀 Stack
+ Frontend: Angular;
+ Backend: Java, Spring, mySQL;
+ Libraries: rxJs;
+ API: TripAdvisor.

## 🌠 Motivation
1. Learn Java syntax and main differences from other languages; 
2. Improve my Angular skills. 

**What have I learned**:
- How to work with complex data that might come from backend, and how to extract data by using nested loops - code can be found in <a href="https://github.com/XeiTon8/TripNext/blob/main/server/trip-next-backend/src/main/java/TripNextApp/tripnextbackend/services/FlightsService.java">Java service for flights</a>.

- How to make different parts of the application to work together (e.g. choosing a departure and destination, defining flight stops and then rendering the final result).

- How to handle additional situation (e.g. user decides to go to the city with only 1 airport. The final destination's code will be changed from the city code to the airport code. For example, if user goes to "ANK" (Ankara), the code will be changed from "ANK" to "ESB".)

A piece of code which shows the logic:
```
 if (destinationCityAirports.length == 1) {
      const nameToCheck = mainFormGroup.get("arrivalAirport.arrivalAirportName")?.value;
      const shortNameToCheck = mainFormGroup.get("arrivalAirport.arrivalAirportShortName")?.value;
      if (nameToCheck && shortNameToCheck) {
        const finalAirportNameToCheck = nameToCheck.split(" ").concat(shortNameToCheck.split(" "));
        for (let i = 0; i < finalAirportNameToCheck.length; i++) {
          if (destinationCityAirports[0].name.includes(finalAirportNameToCheck[i])) {
            mainFormGroup.get("arrivalAirport.arrivalAirportCode")?.setValue(destinationCityAirports[0].airportCode);
            break;
          }}
      }} else if (departureCityAirports.length == 1) {
        const nameToCheck = mainFormGroup.get("departureAirport.departureAirportName")?.value;
        const shortNameToCheck = mainFormGroup.get("departureAirport.departureAirportShortName")?.value;
        if (nameToCheck && shortNameToCheck) {
          const finalAirportNameToCheck = nameToCheck.split(" ").concat(shortNameToCheck.split(" "));
          for (let i = 0; i < finalAirportNameToCheck.length; i++) {
            if (departureCityAirports[0].name.includes(finalAirportNameToCheck[i])) {
              mainFormGroup.get("departureAirport.departureAirportCode")?.setValue(departureCityAirports[0].airportCode);
              break;
            }}}
      } else {
        return;
      }
```
## 🔨 To-Do
- [ ] Implement filtering (by price, distance, etc);

- [ ] Add user account functionality
