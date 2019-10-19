import { Component } from '@angular/core';
import { GeoService } from '../services/geo.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private geoService: GeoService, private menuController: MenuController) { }

  createAlert() {
    this.geoService.pushAlert();
  }

  ionViewWillEnter() {
    this.menuController.enable(true);
  }

}
