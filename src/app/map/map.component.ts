import {Component, OnInit} from '@angular/core';
import {Coords} from "../models/coords";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {GeoService} from "../services/geo.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

    radiusAlert = 100;
    updateDistance = 2;

    userCoords: Coords = {longitude: null, latitude: null};
    lastSearchCoords: Coords = null;

    alertsSubscription: Subscription = null;
    alerts: any[] = [];


    constructor(private geolocation: Geolocation, private geo: GeoService) {
    }

    ngOnInit() {
        this.getUserLocation();
    }

    private getUserLocation() {
        const watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
            const newCoords = {latitude: data.coords.latitude, longitude: data.coords.longitude};
            this.userCoords = newCoords;

            if (!this.lastSearchCoords || this.geo.getDistance(this.userCoords, this.lastSearchCoords) > this.updateDistance) {
                this.lastSearchCoords = newCoords;
                if (this.alertsSubscription) {
                    this.alertsSubscription.unsubscribe();
                }
                this.alerts = [];
                this.alertsSubscription = this.geo.getAlerts(newCoords, this.radiusAlert).subscribe(value => {
                    this.alerts.push(value);
                    console.log('' + value);
                });
            }
        });
    }
}
