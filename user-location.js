'use strict';

const functions = require('firebase-functions');
const DialogflowApp = require('actions-on-google').DialogflowApp;

function userLocation () = {

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

    const requestPermission = (app) => {
      app.askForPermission('To locate you', app.SupportedPermissions.DEVICE_PRECISE_LOCATION);
    };

    const userInfo = (app) => {
        if (app.isPermissionGranted()) {
            const coordinates = app.getDeviceLocation().coordinates;
            var lat=coordinates.latitude;
            if (coordinates) {
                app.tell(`You are at ${lat}`);
            }
            else {
                // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
                // and a geocoded address on voice-activated speakers.
                // Coarse location only works on voice-activated speakers.
                app.tell('Sorry, I could not figure out where you are.');
            }
        } else {
            app.tell('Sorry, I could not figure out where you are.');
        }
    };

    const app = new DialogflowApp({request, response});
    const actions = new Map();
    actions.set('request_permission', requestPermission);
    actions.set('user_info', userInfo);
    app.handleRequest(actions);

});
}
module.exports = {
      userLocation
};
