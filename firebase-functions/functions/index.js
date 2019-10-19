"use strict";
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.useAlerts = functions.firestore.document('alerts/{alertId}').onWrite((change, context) => {
    var db = admin.firestore();
    var alertsCollection = db.collection('alerts');
    var usersCollection = db.collection('users');

    //Get created object
    alertsCollection.doc(context.params.alertId).get().then(newAlert => {
        //Calculate distances
        console.log(newAlert);
        var newAlertCoords = newAlert._fieldsProto.coords.geoPoint;
        usersCollection.get().then(result => {
            console.log('newAlertCoords => ' + newAlertCoords);
            result.forEach(user => {
                var userCoords = user.data().coords;
                console.log(user.id + ' => ' + userCoords);
                var distance = calculateDistance(newAlertCoords.geoPointValue, userCoords);
                console.log('distance: ' + distance);
            });
            return "";
        }).catch(err => {
            console.log('Error getting documents', err);
        });
        return "";
    }).catch(err => {
        console.log('Error getting newAlert ', err);
    })

});


/**
 * Calculates the distance, in kilometers, between two locations, via the
 * Haversine formula. Note that this is approximate due to the fact that
 * the Earth's radius varies between 6356.752 km and 6378.137 km.
 *
 * @param {Object} location1 The first location given as .latitude and .longitude
 * @param {Object} location2 The second location given as .latitude and .longitude
 * @return {number} The distance, in kilometers, between the inputted locations.
 */
function calculateDistance(location1, location2) {

    console.log("location1:" + location1);
    console.log("location2:" + location2);
    console.log("location1 latitude " +  location1.latitude);
    console.log("location1 longitude " +  location1.longitude);
    console.log("location2 latitude " +  location2._latitude);
    console.log("location2 longitude " +  location2._longitude);

    const radius = 6371; // Earth's radius in kilometers
    const latDelta = degreesToRadians(location2._latitude - location1.latitude);
    const lonDelta = degreesToRadians(location2._longitude - location1.longitude);

    const a = (Math.sin(latDelta / 2) * Math.sin(latDelta / 2)) +
        (Math.cos(degreesToRadians(location1.latitude)) * Math.cos(degreesToRadians(location2._latitude)) *
            Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2));

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return radius * c;
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}
