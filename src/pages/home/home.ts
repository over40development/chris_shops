import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: any = [
    {
      name: 'Heaths Crackhouse',
      expanded: false,
      id: 1,
      address: {
        address1: '123 First Street',
        address2: null,
        city: 'Buffalo',
        state: 'NY',
        zipcode: '90210',
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
    }, {
      name: 'Wallys Dingleberries',
      id: 4,
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
    }, {
      name: 'Wallys Dingleberries',
      id: 5,
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
  itemExpandHeight: number = 300;
  markers: any = [];

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(platform: Platform, public navCtrl: NavController, geolocation: Geolocation) {
    // Reset markers
    this.markers = [];

    platform.ready()
      .then(() => {
        // Try Browser Mode First
        navigator.geolocation.getCurrentPosition(position => {

          this.loadMap(position.coords);

          this.items.forEach(item => {
            this.addMarker(item.address.coordinates);
          });

          this.fitBounds();
        }, () => {
          // Switch to Geolocation plugin
          geolocation.getCurrentPosition().then(position => {

            this.loadMap(position.coords);

            this.items.forEach(item => {
              this.addMarker(item.address.coordinates);
            });

            this.fitBounds();
          })
        });
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

      this.map.setCenter(bounds.getCenter());
    });

    this.map.findBounds(bounds);
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

//    this.loadMap(item.address.coordinates);
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
