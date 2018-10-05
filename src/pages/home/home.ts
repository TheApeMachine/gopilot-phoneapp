import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {GoogleMaps, GoogleMap} from '@ionic-native/google-maps';
import {Geolocation} from '@ionic-native/geolocation';
import {AdMobFree, AdMobFreeBannerConfig} from '@ionic-native/admob-free';
import {SpinnerDialog} from '@ionic-native/spinner-dialog';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  map: GoogleMap;

  constructor(
    public navCtrl: NavController, 
    public platform: Platform, 
    private geolocation: Geolocation,
    private admobFree: AdMobFree,
    private spinnerDialog: SpinnerDialog
  ) {
    platform.ready().then(() => {
      this.spinnerDialog.show('Locating you', 'Please wait');

      const bannerConfig: AdMobFreeBannerConfig = {
        // add your config here
        // for the sake of this example we will just use the test config
        id: 'ca-app-pub-2600442269540385~1063615837',
        isTesting: false,
        autoShow: true
      };

      this.admobFree.banner.config(bannerConfig);
  
      this.initMap();
    });
  }

  initMap() {
    this.geolocation.getCurrentPosition().then((data) => {
      this.spinnerDialog.hide();

      this.map = GoogleMaps.create('map-canvas', {
        camera: {
          target: {
            lat: data.coords.latitude,
            lng: data.coords.longitude
          },
          zoom: 18,
          tilt: 30
        }
      });  
    });

    let watch = this.geolocation.watchPosition();

    watch.subscribe((data) => {
      this.map.moveCamera({
        target: {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        },
        zoom: 18,
        tilt: 30
      });
    });
     
    this.admobFree.banner.prepare()
      .then(() => {
        // banner Ad is ready
        // if we set autoShow to false, then we will need to call the show method here
      })
      .catch(e => console.log(e));
  }
}
