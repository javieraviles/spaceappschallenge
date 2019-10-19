// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAjs5nWKP_A9Nixmdhve-CeHnkwNtFB_Rs',
    authDomain: 'safety-network.firebaseapp.com',
    databaseURL: 'https://safety-network.firebaseio.com',
    projectId: 'safety-network',
    storageBucket: 'gs://safety-network.appspot.com',
    messagingSenderId: '1008188197715'
  },
  googleMapsKey: 'AIzaSyCFA9gIZTORFy4j4hopYsloIPnw7VleZZc'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
