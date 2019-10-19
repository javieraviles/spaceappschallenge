import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Coords} from '../models/coords';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {GeoService} from '../services/geo.service';
import {AuthService} from '../services/authentication.service';
import {UserService} from '../services/user.service';
import {Subscription} from 'rxjs';
import {Alert, User} from '../models';
import {LatLngLiteral} from "@agm/core";

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

    @Input() isEditArea = false;

    @Output() refreshCoords: EventEmitter<Coords> = new EventEmitter();

    radiusAlert = 100;
    updateDistance = 2;

    mapPosition: Coords = {longitude: null, latitude: null};

    userCoords: Coords = {longitude: null, latitude: null};

    lastSearchCoords: Coords = null;
    alertsSubscription: Subscription = null;
    singleAlerts: Alert[] = [];
    areaAlerts: Alert[] = [];

    user: User;

    selectedAreaRadius = 0;

    constructor(private geolocation: Geolocation, private geo: GeoService, private userService: UserService,
                private authService: AuthService) {
    }

    async ngOnInit() {
        this.user = await this.authService.getLoggedInUser();
        this.getUserLocation();
    }

    onCenterChange(event: LatLngLiteral) {
        this.mapPosition = {latitude: event.lat, longitude: event.lng};
    }

    onChangeArea(event: any) {
        this.selectedAreaRadius = +event.detail.value;
    }

    sendAreaAlert() {
        this.isEditArea = false;
        this.geo.pushAreaAlert(this.mapPosition, this.selectedAreaRadius);
    }

    private getUserLocation() {
        const watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
            this.userCoords = {latitude: data.coords.latitude, longitude: data.coords.longitude};
            this.subscribeToAlerts();
            this.updateCoords(this.userCoords);
            this.refreshCoords.emit(this.userCoords);
        });
    }

    updateCoords(coords: Coords) {
        this.userService.updateCoords(this.user.uid, coords);
    }

    private subscribeToAlerts() {
        if (!this.lastSearchCoords || this.geo.getDistance(this.userCoords, this.lastSearchCoords) > this.updateDistance) {
            this.lastSearchCoords = this.userCoords;
            if (this.alertsSubscription) {
                this.alertsSubscription.unsubscribe();
            }
            this.singleAlerts = [];
            this.areaAlerts = [];
            this.alertsSubscription = this.geo.getAlerts(this.userCoords, this.radiusAlert).subscribe(documents => {
                this.singleAlerts = [];
                this.areaAlerts = [];
                documents.forEach(document => {
                    const value: any = document;
                    const alert: Alert = value as Alert;
                    switch (alert.type) {
                        case 'SINGLE': {
                            this.singleAlerts.push(alert);
                            break;
                        }
                        case 'AREA': {
                            this.areaAlerts.push(alert);
                            break;
                        }
                        default: {
                            console.warn('Undefined type of alert: ' + alert.type);
                            break;
                        }
                    }
                });
            });
        }
    }
}
