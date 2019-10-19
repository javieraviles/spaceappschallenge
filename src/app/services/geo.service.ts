import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as geofirex from 'geofirex';
import { GeoFireClient, GeoFirePoint, GeoQueryDocument } from 'geofirex';
import * as firebase from 'firebase/app';
import { Coords } from '../models/coords';

@Injectable({
    providedIn: 'root'
})
export class GeoService {

    geo: GeoFireClient;

    constructor() {
        this.geo = geofirex.init(firebase);
    }

    pushAlert() {
        const alerts = this.geo.collection('alerts');
        const point = this.geo.point(40, -119);
        alerts.add({ coords: point.data, radius: 0, type: 'SINGLE' });
    }

    getAlerts(coords: Coords, radius: number): Observable<GeoQueryDocument[]> {
        const geoPoint = this.geo.point(coords.latitude, coords.longitude);
        return this.geo.collection('alerts').within(geoPoint, radius, 'coords');
    }

    getDistance(pointA: Coords, pointB: Coords): number {
        return GeoFirePoint.distance([pointA.latitude, pointA.longitude], [pointB.latitude, pointB.longitude]);
    }
}
