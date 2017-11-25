import React from "react";
import GoButton from "./GoButton.jsx";

import axios from "axios";


export default class GoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "inputFrom": "",
            "inputWhere": "",
            "dateFrom": `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()+1}`,
            "dateBack": "",
            "personAmount": ""
        };
    }
    _inputChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleSubmitButton(){
        let self = this;
        axios.post("/findAvailableFlights", self.state)
            .then(response => {
                response.data.personAmount = self.state.personAmount;
                this.props.history.push("/findFlights", response.data);
            })
            .catch(error => {
                throw new Error("GoForm:handleSubmitButton: " + error.message);
            });
    }
    render() {
        return (
            <div className="GoForm">
                <form >
                    <input name="inputFrom" type="text" value={this.state.inputFrom} onChange={this._inputChange.bind(this)} placeholder="Откуда" className="inputFrom" />
                    <input name="inputWhere" type="text" value={this.state.inputWhere} onChange={this._inputChange.bind(this)} placeholder="Куда" className="inputWhere" />
                    <input name="dateFrom" type="date" value={this.state.dateFrom} onChange={this._inputChange.bind(this)}  className="dateFrom" />
                    <input name="dateBack" type="date" value={this.state.dateBack} onChange={this._inputChange.bind(this)} className="dateBack"/>
                    <input name="personAmount" type="number" value={this.state.personAmount} onChange={this._inputChange.bind(this)} className="personAmount" />
                    <GoButton name="Подобрать" onButtonClick={this.handleSubmitButton.bind(this)} {...this.props} />
                </form>
            </div>
        );
    }
}
