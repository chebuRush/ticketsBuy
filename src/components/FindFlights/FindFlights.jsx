import React from "react";
import LoadingSpinner from "./../StartPage/LoadingSpinner.jsx";
import axios from "axios";
import FilterBox from "./FilterBox.jsx";
import Flight from "./Flight.jsx";

export default class FindFlights extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "flights": this.props.location.state,
            "displayedFlights" : this.props.location.state,
            "submitted" : false
        };
        this.departureAirportFilter = [];
        this.arrivalAirportFilter = [];
        this.state.flights.map((flight)=>{
            if (this.departureAirportFilter.indexOf(flight.airportDeparture) === -1){ this.departureAirportFilter.push(flight.airportDeparture); }
            if (this.arrivalAirportFilter.indexOf(flight.airportArrival) === -1){ this.arrivalAirportFilter.push(flight.airportArrival); }
        });
    }

    _nextButtonClicked() {
        this.props.history.push("/");
    }

    onChooseFlight(flight){
        let self = this;
        flight.personAmount = this.props.location.state.personAmount;
        axios.post("/checkFlightById", flight)
            .then(response => {
                if (response.data.canBeBooked){
                    response.data.personAmount = self.props.location.state.personAmount;
                    self.props.history.push("/additionalInfo" , response.data);
                } else {
                    let newDisplayObj  = self.state.displayedFlights.filter(function(flight) {
                        if (response.data.flightId !== flight.flightId) {
                            return flight;
                        }
                    });
                    self.setState({"displayedFlights" : newDisplayObj});
                    alert("К сожалению, билеты на этот рейс закончились. Попробуйте другой рейс.");
                }
            })
            .catch(error => {
                throw new Error("FindFlights:onChooseFlight: " + error.message);
            });
    }
    handleFilter(userWish){
        let {arr, dep, arrTMin,  depTMin,  durT} = userWish;
        if (this.state.flights.length > 0){
            let displayedFlights = this.state.flights.filter(function (flight){
                return ( (arr.indexOf(flight.airportArrival) !== -1) && (dep.indexOf(flight.airportDeparture) !== -1)
                    &&(new Date(2000,1,25,arrTMin,0) <= new Date(2000,1,25,flight.timeArrival.split(":")[0],flight.timeArrival.split(":")[1]))
                    && (new Date(2000,1,25,depTMin,0) <=  new Date(2000,1,25,flight.timeDeparture.split(":")[0],flight.timeDeparture.split(":")[1]))
                    && ( new Date(1970,0,1,durT,0) >=  new Date(new Date(2000,1,25,(+flight.timeArrival.split(":")[0]-2),flight.timeArrival.split(":")[1]) -
                        new Date(2000,1,25,flight.timeDeparture.split(":")[0],flight.timeDeparture.split(":")[1])))
                );
            });
            this.setState({"displayedFlights" : displayedFlights});
        }

    }
    render() {
        if (this.state.submitted) {
            return <LoadingSpinner/>;
        }
        else if (this.state.displayedFlights.length===0) {
            return (
                <div className="findFlightsComponents">
                    <FilterBox className="col-40" handleFilter={this.handleFilter.bind(this)} departureAirportList={this.departureAirportFilter} arrivalAirportList={this.arrivalAirportFilter}/>
                    <div className="AllFlights col-60">
                        <h1 className="noTickets"> К сожалению, по вашему запросу билетов нет!
                            <div className="returnButtonDiv">
                                <input className="returnButton" type="button" value="Вернуться на главную" onClick={this._nextButtonClicked.bind(this)}/>
                            </div>
                        </h1>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="findFlightsComponents">
                    <FilterBox className="col-40" handleFilter={this.handleFilter.bind(this)} departureAirportList={this.departureAirportFilter} arrivalAirportList={this.arrivalAirportFilter}/>
                    <div className="AllFlights col-60">
                        { this.state.displayedFlights.map((flight) =>{
                            return (
                                <Flight
                                    key={flight.key}
                                    onChoose={this.onChooseFlight.bind(this, flight)}
                                    airportArrival={flight.airportArrival}
                                    airportDeparture={flight.airportDeparture}
                                    timeDeparture={flight.timeDeparture}
                                    timeArrival={flight.timeArrival}
                                    cityDeparture={flight.cityDeparture}
                                    cityArrival={flight.cityArrival}
                                    ticketsAvailable={flight.ticketsAvailable}
                                    airlinesLogo = {flight.airlinesLogoLink}
                                    ticketPrice={flight.ticketPrice} {...self.props} />
                            );
                        })
                        }
                    </div>
                </div>
            );
        }
    }
}

