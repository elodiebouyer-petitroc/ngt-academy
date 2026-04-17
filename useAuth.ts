import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  isSignInWithEmailLink, 
  signInWithEmailLink, 
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer, FirestoreError } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // Don't throw here to avoid crashing the app, but log it clearly
  return errInfo;
}

// Use the local config file as the source of truth.
const config = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
};

const databaseId = firebaseConfig.firestoreDatabaseId;

console.log("Initializing Firebase with Project ID:", config.projectId);

const app = initializeApp(config);
export const db = initializeFirestore(app, {}, databaseId);
export const auth = getAuth(app);

export { 
  isSignInWithEmailLink, 
  signInWithEmailLink, 
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
};

// Test connection to Firestore
async function testConnection() {
  try {
    console.log("[Firebase] Testing connection to Firestore...");
    const docRef = doc(db, 'health_check', 'ping');
    await getDocFromServer(docRef);
    console.log("[Firebase] Firestore connection successful");
  } catch (error: any) {
    handleFirestoreError(error, OperationType.GET, 'health_check/ping');
    if (error.message && error.message.includes('the client is offline')) {
      console.error("[Firebase] Firestore connection failed: the client is offline. Please check your Firebase configuration.");
    } else {
      console.error("[Firebase] Firestore connection test failed:", error.message);
    }
  }
}

testConnection();
