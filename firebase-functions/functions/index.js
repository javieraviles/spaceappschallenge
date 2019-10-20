"use strict";
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.useAlerts = functions.firestore.document('alerts/{alertId}').onCreate((change, context) => {
    var db = admin.firestore();
    var alertsCollection = db.collection('alerts');
    var usersCollection = db.collection('users');

    //Get created object
    alertsCollection.doc(context.params.alertId).get().then(newAlert => {
        //Calculate distances
        var alertUserId = newAlert._fieldsProto.userId.stringValue;
        var radius = newAlert._fieldsProto.radius.integerValue;
        var hazard = newAlert._fieldsProto.hazard.stringValue;
        console.log("alertUserId: " + alertUserId);
        console.log("radius:" + radius);
        console.log("hazard" + hazard);
        var newAlertCoords = newAlert._fieldsProto.coords.mapValue.fields.geopoint.geoPointValue;
        usersCollection.get().then(result => {
            result.forEach(user => {
                var userCoords = user.data().coords.geopoint;
                var distance = calculateDistance(newAlertCoords, userCoords);
                var userId = user.data().uid;
                console.log("user " + user.data().displayName + " distance: " + distance);
                if(distance < (radius / 1000) && userId !== alertUserId){
                    var notification = "There was a " + hazard + " at " + distance.toFixed(2) + "km from your current position";
                    usersCollection.doc(user.data().uid).update({notification : notification});
                }
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
 * @param {Object} alertLocation The first location given as .latitude and .longitude
 * @param {Object} userLocation The second location given as .latitude and .longitude
 * @return {number} The distance, in kilometers, between the inputted locations.
 */
function calculateDistance(alertLocation, userLocation) {

    console.log("alertLocation latitude " +  alertLocation.latitude);
    console.log("alertLocation longitude " +  alertLocation.longitude);
    console.log("userLocation latitude " +  userLocation.latitude);
    console.log("userLocation longitude " +  userLocation.longitude);

    const radius = 6371; // Earth's radius in kilometers
    const latDelta = degreesToRadians(userLocation.latitude - alertLocation.latitude);
    const lonDelta = degreesToRadians(userLocation.longitude - alertLocation.longitude);

    const a = (Math.sin(latDelta / 2) * Math.sin(latDelta / 2)) +
        (Math.cos(degreesToRadians(alertLocation.latitude)) * Math.cos(degreesToRadians(userLocation.latitude)) *
            Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2));

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return radius * c;
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}
