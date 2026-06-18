import { auth, db } from '@/config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInAnonymously,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  syncUserToFirestore: async (user, isGuest = false) => {
    if (!user) return null;
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    const userData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || (isGuest ? 'Guest User' : ''),
      photoURL: user.photoURL || '',
      provider: isGuest ? 'anonymous' : user.providerData[0]?.providerId || 'password',
      lastLogin: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!userSnap.exists()) {
      Object.assign(userData, {
        bio: '',
        country: '',
        language: 'en',
        travelPreferences: [],
        createdAt: new Date().toISOString(),
      });
    }

    await setDoc(userRef, userData, { merge: true });
    return userData;
  },

  loginWithEmail: async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await authService.syncUserToFirestore(cred.user);
    return cred.user;
  },

  signupWithEmail: async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Send verification
    await sendEmailVerification(cred.user);
    // Firebase doesn't take displayName in createUser, so we pass it manually to firestore
    cred.user.displayName = displayName;
    await authService.syncUserToFirestore(cred.user);
    return cred.user;
  },

  loginWithGoogle: async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await authService.syncUserToFirestore(cred.user);
    return cred.user;
  },

  loginAsGuest: async () => {
    const cred = await signInAnonymously(auth);
    await authService.syncUserToFirestore(cred.user, true);
    return cred.user;
  },

  resetPassword: async (email) => {
    await sendPasswordResetEmail(auth, email);
  },

  logout: async () => {
    await signOut(auth);
  }
};
