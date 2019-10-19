import {Component} from '@angular/core';
import {GeoService} from '../services/geo.service';
import {Coords} from '../models';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    isEditArea = false;

    selfCoords: Coords;
    selfAlertId = null;

    constructor(private geoService: GeoService) {
    }


    clickAlert() {
        this.geoService.pushSingleAlert(this.selfAlertId, this.selfCoords);
    }

    editAreaAlert() {
        this.isEditArea = true;
    }

    async updateCoords(coords: Coords) {
        this.selfCoords = coords;
        if (this.selfAlertId) {
            this.selfAlertId = await this.geoService.pushSingleAlert(this.selfAlertId, this.selfCoords);
        }
    }
}
