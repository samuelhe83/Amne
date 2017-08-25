import React, { Component } from 'react';
import Infinite from 'react-infinite';
import RealEstateItem from './RealEstateItem';

class RealEstateList extends Component {
  constructor(props) {
    super(props);
    this.state = { results: [] };
  }

  componentWillReceiveProps(nextProps) {
    const modifiedResults = [];
    for (let i = 0; i < this.props.results.length; i++) {
      let latitude = this.props.results[i].geometry.location.lat();
      let longitude = this.props.results[i].geometry.location.lng();
      let modifiedResult = { ...this.props.results[i] };

      this.getDistance(latitude, longitude).then(distance => (modifiedResult.distance = distance));

      modifiedResults.push(modifiedResult);
    }
    modifiedResults.sort((a, b) => {
      if (a.distance > b.distance) {
        return 1;
      } else {
        return -1;
      }
    });
    this.setState({ results: modifiedResults });
  }

  getDistance(lat, lng) {
    const address1 = new google.maps.LatLng(this.props.address1.lat, this.props.address1.lng);
    const address2 = new google.maps.LatLng(this.props.address2.lat, this.props.address2.lng);
    const service = new google.maps.DistanceMatrixService();
    let distance = 0;
    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(
        {
          origins: [address1, address2],
          destinations: [{ lat: lat, lng: lng }],
          travelMode: 'DRIVING'
        },
        (response, status) => {
          if (status === 'OK') {
            let result = response.rows[0].elements;
            for (let j = 0; j < result.length; j++) {
              distance += result[j].distance.value;
            }
            resolve(distance);
          } else {
            reject(status);
          }
        }
      );
    }).catch(status => console.log('Error getting distance ', status));
  }

  render() {
    return (
      <Infinite containerHeight={550} elementHeight={40} className="listContainer">
        {this.state.results.map(location => <RealEstateItem data={location} key={location.place_id} />)}
      </Infinite>
    );
  }
}

export default RealEstateList;
