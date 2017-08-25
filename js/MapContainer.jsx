import React, { Component } from 'react';
import RealEstateList from './RealEstateList';
import _ from 'lodash';

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { address1: '', address2: '', invalid: false, address1Results: [], address2Results: [] };
  }

  componentDidMount() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(30.307182, -97.755996),
      zoom: 11
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.address1 !== nextProps.address1) {
      this.findCoords(nextProps.address1)
        .then(location => {
          this.setState({ address1: location });
          return;
        })
        .then(() => {
          return this.findAgencies(this.state.address1);
        })
        .then(results => {
          for (let i = 0; i < results.length; i++) {
            results[i].marker = this.createMarker(results[i]);
          }
          this.setState({ address1Results: results, invalid: false });
        });
    }

    if (this.props.address2 !== nextProps.address2) {
      this.findCoords(nextProps.address2, 'address2')
        .then(location => {
          this.setState({ address2: location });
        })
        .then(() => {
          return this.findAgencies(this.state.address2);
        })
        .then(results => {
          for (let i = 0; i < results.length; i++) {
            results[i].marker = this.createMarker(results[i]);
          }
          this.setState({ address2Results: results, invalid: false });
        });
    }
  }

  findCoords(address) {
    const geocoder = new google.maps.Geocoder();
    const location = {};
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          location.lat = results[0].geometry.location.lat();
          location.lng = results[0].geometry.location.lng();
          resolve(location);
        } else {
          reject(status);
          return;
        }
      });
    }).catch(status => {
      this.setState({ invalid: true });
    });

    geocoder.geocode({ address: address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        location.lat = results[0].geometry.location.lat();
        location.lng = results[0].geometry.location.lng();
        return location;
      } else {
        return;
      }
    });
  }

  findAgencies(location) {
    const map = new google.maps.LatLng(location.lat, location.lng);
    const request = {
      location: map,
      radius: '16093',
      type: ['real_estate_agency']
    };

    const service = new google.maps.places.PlacesService(this.map);
    return new Promise((resolve, reject) => {
      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    }).catch(status => {
      this.setState({ invalid: true });
      console.log('Error finding agencies ', status);
    });
  }

  createMarker(place) {
    const latLng = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
    const marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: location.name
    });
    const infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(
        '<div><strong>' +
          place.name +
          '</strong><br>' +
          'Place ID: ' +
          place.place_id +
          '<br>' +
          place.formatted_address +
          '</div>'
      );
      infowindow.open(map, this);
    });

    return marker;
  }

  errorMessage() {
    if (this.state.invalid) {
      return <div>Invalid address entered. Please enter a valid address</div>;
    }
  }

  render() {
    return (
      <div>
        {this.errorMessage()}
        <div id="mapContainer">
          <div id="map" />
          <RealEstateList
            address1={this.state.address1}
            address2={this.state.address2}
            results={_.uniqBy(this.state.address1Results.concat(this.state.address2Results), 'place_id')}
            map={this.map}
          />
        </div>
      </div>
    );
  }
}

export default MapContainer;
