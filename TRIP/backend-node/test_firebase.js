import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (err) {
    console.error("Caught error:", err.message);
  }
}

try {
  const db = admin.firestore();
  console.log("Success");
} catch (err) {
  console.error("Firestore throw:", err.message);
}
