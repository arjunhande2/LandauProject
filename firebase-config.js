/*
 * Firebase web configuration.
 *
 * Replace the placeholder values below with the configuration copied from:
 * Firebase Console > Project settings > Your apps > Web app.
 *
 * Firebase web configuration values identify the project; access is protected
 * by Firebase Authentication and the Firestore security rules in this project.
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyDqsZrtUQXhy7WkOt8gQa6I51BJaltCVWI',
  authDomain: 'scannerdatabasegage.firebaseapp.com',
  projectId: 'scannerdatabasegage',
  storageBucket: 'scannerdatabasegage.firebasestorage.app',
  messagingSenderId: '1017600933078',
  appId: '1:1017600933078:web:aa2abe62e28f7b60049d77'
};

/* Database collection settings used by database.html. */
export const databaseSettings = {
  collectionName: 'inventory'
};

/* Prevent the portal from attempting a connection before setup is complete. */
export function isFirebaseConfigured() {
  const requiredValues = [
    firebaseConfig.apiKey,
    firebaseConfig.authDomain,
    firebaseConfig.projectId,
    firebaseConfig.appId
  ];

  return requiredValues.every(value => value && !String(value).startsWith('REPLACE_WITH_'));
}
