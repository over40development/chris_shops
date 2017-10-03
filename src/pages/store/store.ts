import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'page-store',
  templateUrl: 'store.html'
})
export class StorePage {

  items: any = [
    {
      name: 'Heaths Crackhouse',
      expanded: false,
      id: 1,
      address: {
        address1: '171 Lincoln Street',
        address2: null,
        city: 'West Jefferson',
        state: 'OH',
        zipcode: '64162',
        coordinates: {
          longitude: -94.2,
          latitude: 39
        }
      }
    }, {
      name: 'Jonathon Dropouts',
      expanded: false,
      id: 2,
      address: {
        address1: '1 Nowhere Road',
        address2: null,
        city: 'Boise',
        state: 'ID',
        zipcode: '12345',
        coordinates: {
          longitude: -94.1,
          latitude: 39.5
        }
      }
    }, {
      name: 'Wallys Dingleberries',
      id: 3,
      expanded: false,
      address: {
        address1: '911 PSN SDK WAY',
        address2: null,
        city: 'St. Paul',
        state: 'MN',
        zipcode: '23232',
        coordinates: {
          longitude: -94.0008,
          latitude: 39.3
        }
      }
    }];
  itemExpandHeight: number = 75;
  markers: any = [];
  myPosition: any;
  geocoder: any = new google.maps.Geocoder();
  directionsDisplay: any = new google.maps.DirectionsRenderer();
  directionsService: any = new google.maps.DirectionsService();

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(platform: Platform, public navCtrl: NavController, geolocation: Geolocation) {
    // Reset markers
    this.markers = [];

    platform.ready()
      .then(() => {
        // Try Browser Mode First
        navigator.geolocation.getCurrentPosition(position => {
          this.myPosition = position;

          this.loadMap(position.coords);

          this.items.forEach(item => {
            //let addString = [item.address.address1, item.address.city, item.address.state, item.address.zipcode].join(', ');
            //this.geocodeAddress(item.name, addString);

            this.addMarker(item.address.coordinates);
          });

          this.fitBounds();
        }, () => {
          // Switch to Geolocation plugin
          geolocation.getCurrentPosition().then(position => {
            this.myPosition = position;

            this.loadMap(position.coords);

            this.items.forEach(item => {
              this.addMarker(item.address.coordinates);
            });

            this.fitBounds();
          })
        });

        this.directionsDisplay.setMap(this.map);
      });
  }

  geocodeAddress(name: string, address: any) {

    this.geocoder.geocode({'address': address}, function (results, status) {
      if (status == 'OK') {
        this.map.setCenter(results[0].geometry.location);

        let marker = new google.maps.Marker({
          map: this.map,
          position: results[0].geometry.location
        });

        this.markers.push(marker);

        let content = `<h4>{{name}}</h4>`;

        this.addInfoWindow(marker, content);

      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  fitBounds() {

    let bounds = new google.maps.LatLngBounds();
    for (let index = 0; index < this.markers.length; index++) {
      bounds.extend(this.markers[index].getPosition());
    }

    google.maps.event.addListenerOnce(this.map, 'bounds_changed', function() {
      this.setZoom(this.getZoom()-1);

      if (this.getZoom() > 15) {
        this.setZoom(15);
      }

      this.setCenter(bounds.getCenter());

      this.fitBounds(bounds);
    });
  }

  expandItem(item) {

    this.items.map(listItem => {

      if (item == listItem) {
        listItem.expanded = !listItem.expanded;
      } else {
        listItem.expanded = false;
      }

      return listItem;

    });
  }

  loadMap(position: any) {

    let latLng = new google.maps.LatLng(position.latitude, position.longitude);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  addMarker(position: any) {

    let marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(position.latitude, position.longitude),
      map: this.map
    });

    this.markers.push(marker);

    let content = "<h4>Information!</h4>";

    this.addInfoWindow(marker, content);

    this.calculateAndDisplayRoute(position);
  }

  calculateAndDisplayRoute(position: any) {

    this.directionsService.route({
      origin: new google.maps.LatLng(this.myPosition.latitude, this.myPosition.longitude),
      destination: new google.maps.LatLng(position.latitude, position.longitude),
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      }
    });
  }

  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {

      infoWindow.open(this.map, marker);
    });
  }

}
