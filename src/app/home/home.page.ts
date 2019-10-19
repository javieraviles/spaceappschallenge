import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Coords } from '../models/Coords';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  myCoords: Coords;
  constructor(private geolocation: Geolocation, private db: AngularFirestore) { }

  ngOnInit(): void {
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   this.myCoords = { latitude: resp.coords.latitude, longitude: resp.coords.longitude };
    //   this.persistCoords(this.myCoords);
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
    //
    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   this.myCoords = { latitude: data.coords.latitude, longitude: data.coords.longitude };
    //   this.persistCoords(this.myCoords);
    // });

  }

  // persistCoords(coords: Coords) {
  //   this.db.collection<Coords>('coords').doc('user-javi').set(coords);
  // }
}
