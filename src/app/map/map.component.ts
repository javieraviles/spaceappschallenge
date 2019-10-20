import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Coords } from '../models/coords';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeoService } from '../services/geo.service';
import { AuthService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { Alert, User } from '../models';
import { AlertController } from '@ionic/angular';
import { LatLngLiteral } from "@agm/core";

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

    radiusAlert = 100;
    updateDistance = 2;
    mapPosition: Coords = null;
    userCoords: Coords = { longitude: null, latitude: null };
    lastSearchCoords: Coords = null;
    alertsSubscription: Subscription = null;
    singleAlerts: Alert[] = [];
    areaAlerts: Alert[] = [];
    user: User;
    userInfo: User;

    // Area alert vairables
    isEditArea = false;
    selectedAreaRadius = 0;
    selectedHazard = '';

    // Self alert variables.
    selfAlertId = null;
    singleAlertEnabled = false;

    constructor(private geolocation: Geolocation, private geo: GeoService, private userService: UserService,
        private authService: AuthService, private alertController: AlertController) {
    }

    async ngOnInit() {
        this.user = await this.authService.getLoggedInUser();
        this.getUserLocation();
        this.userService.getUser(this.user.uid).valueChanges().subscribe((user) => {
            this.userInfo = user;
            if (user.notification && !this.singleAlertEnabled) {
                this.presentNotification(user.notification);
            }
        });
    }
    async presentNotification(notification: string) {
        const alert = await this.alertController.create({
            header: 'Alert near you!',
            subHeader: notification,
            message: 'ARE YOU SAFE?',
            buttons: [{
                text: 'NO',
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                    this.userService.removeNotification(this.user.uid);
                    this.geo.pushSingleAlert(null, this.userCoords, this.user.uid, this.userInfo.gender, this.calculateAge(this.userInfo.birth));
                }
            }, {
                text: 'YES',
                handler: () => {
                    this.userService.removeNotification(this.user.uid);
                }
            }]
        });
        await alert.present();
    }

    onCenterChange(event: LatLngLiteral) {
        this.mapPosition = { latitude: event.lat, longitude: event.lng };
    }

    onChangeArea(event: any) {
        this.selectedAreaRadius = +event.detail.value;
    }

    onChangeHazard(event: any) {
        this.selectedHazard = event.detail.value;
    }

    getAlertIcon(alert: Alert) {
        if (alert.id === this.selfAlertId) {
            return '../../assets/marks/self-mark-alert.png';
        } else {
            return '../../assets/marks/other-mark-alert.png';
        }
    }

    getHazardColor(hazard: string) {
        switch (hazard) {
            case 'FIRE': {
                return '#B22222';
            }
            case 'FLOOD': {
                return '#1E90FF';
            }
            case 'EARTHQUAKE': {
                return '#CD853F';
            }
            case 'BIO': {
                return '#2E8B57';
            }
            default: {
                return '#A9A9A9';
            }
        }
    }

    sendAreaAlert() {
        this.isEditArea = false;
        this.geo.pushAreaAlert(this.mapPosition, this.selectedAreaRadius, this.selectedHazard, this.user.uid);
    }

    cancelAreaAlert() {
        this.isEditArea = false;
    }

    createSingleAlert() {
        this.geo.pushSingleAlert(this.selfAlertId, this.userCoords, this.user.uid, this.userInfo.gender, this.calculateAge(this.userInfo.birth));
    }

    deleteSingleAlert() {
        this.geo.deleteAlert(this.selfAlertId);
    }

    editAreaAlert() {
        this.selectedHazard = 'GENERIC';
        this.selectedAreaRadius = 100;
        this.isEditArea = true;
    }

    private getUserLocation() {
        const watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
            this.userCoords = { latitude: data.coords.latitude, longitude: data.coords.longitude };
            this.subscribeToAlerts();
            this.updateCoords(this.userCoords);
            if (this.selfAlertId) {
                this.geo.pushSingleAlert(this.selfAlertId, this.userCoords, this.user.uid, this.userInfo.gender, this.calculateAge(this.userInfo.birth)).then((value) => {
                    this.selfAlertId = value;
                });
            }
            if (!this.mapPosition) {
                this.mapPosition = this.userCoords;
            }
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
                this.selfAlertId = null;
                this.singleAlertEnabled = false;
                documents.forEach(document => {
                    const value: any = document;
                    const alert: Alert = value as Alert;
                    if ((alert.userId == this.user.uid) && (alert.type == 'SINGLE')) {
                        this.selfAlertId = alert.id;
                        this.singleAlertEnabled = true;
                    }
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

    private calculateAge(birth: number) {
        const currentYear = new Date().getFullYear();
        return currentYear - birth;
    }
}
