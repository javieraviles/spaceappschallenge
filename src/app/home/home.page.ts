import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AuthService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { User, Coords } from '../models';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  myCoords: Coords;
  user: User;
  constructor(private geolocation: Geolocation,  private authService: AuthService, private userService: UserService) { }

  async ngOnInit() {
    this.user = await this.authService.getLoggedInUser();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.myCoords = { latitude: resp.coords.latitude, longitude: resp.coords.longitude };
      this.updateCoords(this.myCoords);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.myCoords = { latitude: data.coords.latitude, longitude: data.coords.longitude };
      this.updateCoords(this.myCoords);
    });

  }

  updateCoords(coords: Coords) {
    this.userService.updateCoords(this.user.uid, coords);
    console.log('coords updated');
  }
}
