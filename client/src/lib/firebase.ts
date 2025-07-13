import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Debug: Check if all required config values are present
console.log('Firebase Config Check:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
});

// Initialize Firebase only if all required config values are present
let app: any = null;
let storage: any = null;
let analytics: any = null;

const hasRequiredConfig = !!(firebaseConfig.apiKey && 
                            firebaseConfig.authDomain && 
                            firebaseConfig.projectId && 
                            firebaseConfig.storageBucket && 
                            firebaseConfig.appId);

if (hasRequiredConfig) {
  try {
    app = initializeApp(firebaseConfig);
    storage = getStorage(app);
    
    // Only initialize analytics in browser environment
    if (typeof window !== "undefined") {
      analytics = getAnalytics(app);
    }
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
} else {
  console.warn('Firebase config incomplete. Some features may not work.');
}

// Upload multiple images to Firebase Storage
export const uploadImages = async (files: File[]): Promise<string[]> => {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized. Please check your configuration.');
  }

  const uploadPromises = files.map(async (file) => {
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `products/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    // Upload file
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  });

  return Promise.all(uploadPromises);
};

// Delete image from Firebase Storage
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract path from URL
    const url = new URL(imageUrl);
    const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

export { storage, analytics };