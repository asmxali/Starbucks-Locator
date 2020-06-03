var map;
var markers = [];
var infoWindow;
var toronto = { lat: 43.6532, lng: -79.3832 };
function initMap() {
  // put this map inside div where id is map
  map = new google.maps.Map(document.getElementById("map"), {
    // creates the center of the app
    center: toronto,
    zoom: 11,
    styles: [
      {
        elementType: "geometry",
        stylers: [
          {
            color: "#f5f5f5",
          },
        ],
      },
      {
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#616161",
          },
        ],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#f5f5f5",
          },
        ],
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#bdbdbd",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          {
            color: "#eeeeee",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#757575",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
          {
            color: "#e5e5e5",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9e9e9e",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#757575",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
          {
            color: "#dadada",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#e3c5c5",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#616161",
          },
        ],
      },
      {
        featureType: "road.highway.controlled_access",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#e3c5c5",
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#f0e0e3",
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9e9e9e",
          },
        ],
      },
      {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [
          {
            color: "#e5e5e5",
          },
        ],
      },
      {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [
          {
            color: "#eeeeee",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#c9c9c9",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#e3c5c5",
          },
          {
            weight: 0.5,
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9e9e9e",
          },
        ],
      },
    ],
  });
  infoWindow = new google.maps.InfoWindow();
  searchStores();
  showStoreMarker(stores);
  setOnClickListener();
}

function showStoreMarker(stores) {
  var bounds = new google.maps.LatLngBounds();
  stores.forEach((store, index) => {
    var latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude
    );
    var name = store.name;
    var address = store.address.streetAddressLine1;
    var phone = store.phoneNumber;
    var statusText = "6:00 pm";
    bounds.extend(latlng);
    createMarker(latlng, name, address, statusText, phone, index);
  });
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, statusText, phone, index) {
  var html = `<div class='store-info-window'>
      <div class='store-info-name'>
      ${name}
      </div>
      <div class='store-info-status'>
      Open until ${statusText}
      </div>
      <div class='store-info-address'>
      <div class='circle'> 
      <i class='fas fa-location-arrow' > </i>
      </div>
      ${address}
      </div>
      <div class='store-info-phone'>
      <div class='circle'> 
      <i class='fas fa-phone' > </i>
      </div>

      ${phone}
      </div>
   </div>`;

  let icon = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: "#61755e8f",
    fillOpacity: 1,
    strokeWeight: 4,
    strokeColor: "#62765f",
    // scaledSize: new google.maps.Size(85, 40), // scaled size
    // origin: new google.maps.Point(0, 0), // origin
    // anchor: new google.maps.Point(0, 0), // anchor
  };

  var marker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.BOUNCE,
    position: latlng,
    icon: icon,
  });

  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

function searchStores() {
  let foundStores = [];
  let searchInput = document
    .getElementById("postal-code-id")
    .value.toUpperCase()
    .substring(0, 3);

  if (searchInput) {
    stores.forEach((store) => {
      let postalCode = store.address.postalCode.toUpperCase().substring(0, 3);

      if (searchInput == postalCode) {
        foundStores.push(store);
      }
    });
  } else {
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);
  showStoreMarker(foundStores);
  setOnClickListener();
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}
function setOnClickListener() {
  var storeElements = document.querySelectorAll(".store-container");
  // console.log(storeElements);
  storeElements.forEach((elem, index) => {
    console.log(elem);
    elem.addEventListener("click", () => {
      google.maps.event.trigger(markers[index], "click");
    });
  });
}

function displayStores(stores) {
  // create a variable to store html
  let storesHTML = "";

  // loop through the store data
  stores.forEach((store, index) => {
    // console.log(store);
    let address = store.address;
    let phone = store.phoneNumber;
    storesHTML += `
    <div class= "store-container">
      <div class="store-container-background">
            
        <div class="store-info-container">
                  <div class="store-address">
                       <span>${address.streetAddressLine1}</span>
                       <span> ${address.city}, ${
      address.countrySubdivisionCode
    } ${address.postalCode.toUpperCase()}</span>
                   </div>
                  <div class="store-phone-number">
                     ${phone}
                  </div>
        </div>
        <div class="store-number-container">
          <div class="store-number">${index + 1}</div>
        </div>

      </div>
    </div>
    `;
  });
  let a = (document.querySelector(".stores-list").innerHTML = storesHTML);
}
