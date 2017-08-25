import React, { Component } from 'react';
import MapContainer from './MapContainer';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { address1: '', address2: '' };
    this.addresses = {};
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
  }

  handleSearchChange(e) {
    e.preventDefault();
    let newState = {};
    let name = e.target.name;
    let value = e.target.value;
    this.addresses[name] = value;
  }

  handleAddressChange(e) {
    e.preventDefault();
    this.setState({ address1: this.addresses.address1, address2: this.addresses.address2 });
  }

  render() {
    return (
      <div>
        <header>Real Estate Agency Finder</header>
        <br />
        <input
          type="text"
          className="search"
          placeholder="Enter First Address"
          name="address1"
          onChange={this.handleSearchChange}
        />
        <input
          type="text"
          className="search"
          placeholder="Enter Second Address"
          name="address2"
          onChange={this.handleSearchChange}
        />
        <button type="submit" className="submitButton" onClick={this.handleAddressChange}>
          Find Agencies
        </button>
        <br />
        <MapContainer address1={this.state.address1} address2={this.state.address2} />
      </div>
    );
  }
}

export default Search;
