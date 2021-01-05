import React, { Component } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", etat: "" };

    this.handleChange = this.handleChange.bind(this);
    this.openDoor = this.openDoor.bind(this);
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  openDoor(event) {
    //alert("A name was submitted: " + this.state.value);
    axios.get("http://localhost:3000/door").then(res => {
      this.state.etat = res.data.value;
      return <p> {this.state.etat} </p>;
    });
    event.preventDefault();
  }

  render() {
    return (
      <form>
        <label>
          Name:
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <h2>{this.state.etat}</h2>
        <button onClick={this.openDoor}>open door </button>
      </form>
    );
  }
}

export default App;
