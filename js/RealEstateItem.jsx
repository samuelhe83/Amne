import React from 'react';

function RealEstateItem(props) {
  const { name, formatted_address, marker, place_id } = props.data;
  const infowindow = new google.maps.InfoWindow();

  function openMarker() {
    infowindow.setContent(
      '<div><strong>' + name + '</strong><br>' + 'Place ID: ' + place_id + '<br>' + formatted_address + '</div>'
    );
    infowindow.open(map, marker);
  }

  return (
    <div onClick={openMarker}>
      <ul className="listItem">
        <div>
          {name}
        </div>
        <div>
          {formatted_address}
        </div>
      </ul>
    </div>
  );
}

export default RealEstateItem;
