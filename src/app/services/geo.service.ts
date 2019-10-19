import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as geofirex from 'geofirex';
import {GeoFireClient, GeoFirePoint} from 'geofirex';
import * as firebase from 'firebase/app';
import {Coords} from '../models/coords';

@Injectable({
    providedIn: 'root'
})
export class GeoService {

    geo: GeoFireClient;

    constructor() {
        this.geo = geofirex.init(firebase);
    }

    getAlerts(coords: Coords, radius: number): Observable<any> {
        const geoPoint = this.geo.point(coords.latitude, coords.longitude);
        console.log(JSON.stringify(coords) + ' ' + radius);

        return this.geo.collection('alerts').within(geoPoint, radius, 'coords');
    }

    getDistance(pointA: Coords, pointB: Coords): number {
        return GeoFirePoint.distance([pointA.latitude, pointA.longitude], [pointB.latitude, pointB.longitude]);
    }
}
