import { initializeApp } from 'firebase/app';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false
};


const firebaseConfig = {
    apiKey: 'AIzaSyAhod5EQ_wRW3eEz8Zsaw3Ya6WCQ9sldlg',
    authDomain: 'messaging-db163.firebaseapp.com',
    projectId: 'messaging-db163',
    storageBucket: 'messaging-db163.appspot.com',
    messagingSenderId: '901664692612',
    appId: '1:901664692612:web:d97bc043a1b2f99f5ee5d1',
    measurementId: 'G-LXVMRHP2J0',
};

initializeApp(firebaseConfig);

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
