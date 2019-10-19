import { Component } from '@angular/core';
import { GeoService } from '../services/geo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private geoService: GeoService) { }

  createAlert() {
    this.geoService.pushAlert();
  }

}
