/*
 * Firebase web configuration.
 *
 * Replace the placeholder values below with the configuration copied from:
 * Firebase Console > Project settings > Your apps > Web app.
 *
 * Firebase web configuration values identify the project. This public version
 * relies on the included Firestore rules and does not use Firebase Authentication.
 */
export const firebaseConfig = {
  apiKey: 'REPLACE_WITH_FIREBASE_API_KEY',
  authDomain: 'REPLACE_WITH_PROJECT_ID.firebaseapp.com',
  projectId: 'REPLACE_WITH_PROJECT_ID',
  storageBucket: 'REPLACE_WITH_PROJECT_ID.firebasestorage.app',
  messagingSenderId: 'REPLACE_WITH_MESSAGING_SENDER_ID',
  appId: 'REPLACE_WITH_FIREBASE_APP_ID'
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
