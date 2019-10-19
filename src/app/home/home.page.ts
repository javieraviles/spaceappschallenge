import { Component } from '@angular/core';
import { GeoService } from '../services/geo.service';
import { MenuController } from '@ionic/angular';
import { Coords } from '../models';
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    constructor(private geoService: GeoService, private menuController: MenuController) { }

    selfCoords: Coords
    selfAlertId = null;

    ionViewWillEnter() {
        this.menuController.enable(true);
    }

    clickAlert() {
        this.geoService.pushSingleAlert(this.selfAlertId, this.selfCoords);
    }

    async updateCoords(coords: Coords) {
        this.selfCoords = coords;
        if (this.selfAlertId) {
            this.selfAlertId = await this.geoService.pushSingleAlert(this.selfAlertId, this.selfCoords);
        }
    }
}
