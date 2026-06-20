import { db } from '../../config/firebase';
import { 
  collection, doc, getDoc, getDocs, addDoc, 
  updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, limit, startAfter 
} from 'firebase/firestore';

const TRIPS_COLLECTION = 'trips';

export const tripsService = {
  /**
   * Get all trips for a specific user with pagination
   */
  getAllTrips: async (userId, limitCount = 10, pageParam = null) => {
    if (!userId) throw new Error("User ID is required to fetch trips");
    
    const tripsRef = collection(db, TRIPS_COLLECTION);
    
    let qArgs = [
      where("userId", "==", userId), 
      orderBy("createdAt", "desc"),
      limit(limitCount)
    ];

    if (pageParam) {
      const docRef = doc(db, TRIPS_COLLECTION, pageParam);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        qArgs.push(startAfter(docSnap));
      }
    }
    
    const q = query(tripsRef, ...qArgs);
    
    const querySnapshot = await getDocs(q);
    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push({ id: doc.id, ...doc.data() });
    });
    
    const lastDocId = trips.length > 0 ? trips[trips.length - 1].id : null;
    const hasMore = trips.length === limitCount;

    return { data: trips, lastDocId, hasMore };
  },
  
  /**
   * Get a specific trip by ID
   */
  getTripById: async (id) => {
    if (!id) throw new Error("Trip ID is required");
    
    const tripRef = doc(db, TRIPS_COLLECTION, id);
    const tripSnap = await getDoc(tripRef);
    
    if (!tripSnap.exists()) {
      throw new Error("Trip not found");
    }
    
    return { data: { id: tripSnap.id, ...tripSnap.data() } };
  },

  /**
   * Create a new trip
   */
  createTrip: async (tripData) => {
    if (!tripData.userId) throw new Error("User ID is required to create a trip");
    
    const tripsRef = collection(db, TRIPS_COLLECTION);
    const newTripData = {
      ...tripData,
      isPublic: tripData.isPublic || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(tripsRef, newTripData);
    
    return { 
      data: { 
        id: docRef.id, 
        ...newTripData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } 
    };
  },

  /**
   * Update an existing trip
   */
  updateTrip: async (id, tripData) => {
    if (!id) throw new Error("Trip ID is required");
    
    const tripRef = doc(db, TRIPS_COLLECTION, id);
    const updateData = {
      ...tripData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(tripRef, updateData);
    
    return { data: { id, ...updateData } };
  },

  /**
   * Delete a trip
   */
  deleteTrip: async (id) => {
    if (!id) throw new Error("Trip ID is required");
    
    const tripRef = doc(db, TRIPS_COLLECTION, id);
    await deleteDoc(tripRef);
    
    return { success: true };
  },

  /**
   * Duplicate a trip
   */
  duplicateTrip: async (id, userId) => {
    if (!id || !userId) throw new Error("Trip ID and User ID are required");
    
    const tripSnap = await getDoc(doc(db, TRIPS_COLLECTION, id));
    if (!tripSnap.exists()) {
      throw new Error("Trip not found");
    }
    
    const originalTrip = tripSnap.data();
    const newTripData = {
      ...originalTrip,
      title: `${originalTrip.title || 'Trip'} (Copy)`,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const tripsRef = collection(db, TRIPS_COLLECTION);
    const docRef = await addDoc(tripsRef, newTripData);
    
    return { 
      data: { 
        id: docRef.id, 
        ...newTripData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } 
    };
  },

  /**
   * Archive a trip (soft delete or status change)
   */
  archiveTrip: async (id) => {
    if (!id) throw new Error("Trip ID is required");
    
    const tripRef = doc(db, TRIPS_COLLECTION, id);
    await updateDoc(tripRef, { 
      status: 'archived',
      updatedAt: serverTimestamp() 
    });
    
    return { success: true };
  },

  /**
   * Toggle Trip Privacy
   */
  toggleTripPrivacy: async (id, isPublic) => {
    if (!id) throw new Error("Trip ID is required");
    
    const tripRef = doc(db, TRIPS_COLLECTION, id);
    await updateDoc(tripRef, { 
      isPublic: isPublic,
      updatedAt: serverTimestamp() 
    });
    
    return { success: true, isPublic };
  },

  /**
   * Get all public trips (Community Feed)
   */
  getPublicTrips: async (limitCount = 10, pageParam = null) => {
    const tripsRef = collection(db, TRIPS_COLLECTION);
    
    let qArgs = [
      where("isPublic", "==", true), 
      orderBy("createdAt", "desc"),
      limit(limitCount)
    ];

    if (pageParam) {
      const docRef = doc(db, TRIPS_COLLECTION, pageParam);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        qArgs.push(startAfter(docSnap));
      }
    }
    
    const q = query(tripsRef, ...qArgs);
    const querySnapshot = await getDocs(q);
    
    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push({ id: doc.id, ...doc.data() });
    });
    
    const lastDocId = trips.length > 0 ? trips[trips.length - 1].id : null;
    const hasMore = trips.length === limitCount;

    return { data: trips, lastDocId, hasMore };
  },

  /**
   * Get a specific user's public trips
   */
  getUserPublicTrips: async (userId, limitCount = 10, pageParam = null) => {
    if (!userId) throw new Error("User ID is required");
    
    const tripsRef = collection(db, TRIPS_COLLECTION);
    
    let qArgs = [
      where("userId", "==", userId),
      where("isPublic", "==", true), 
      orderBy("createdAt", "desc"),
      limit(limitCount)
    ];

    if (pageParam) {
      const docRef = doc(db, TRIPS_COLLECTION, pageParam);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        qArgs.push(startAfter(docSnap));
      }
    }
    
    const q = query(tripsRef, ...qArgs);
    const querySnapshot = await getDocs(q);
    
    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push({ id: doc.id, ...doc.data() });
    });
    
    const lastDocId = trips.length > 0 ? trips[trips.length - 1].id : null;
    const hasMore = trips.length === limitCount;

    return { data: trips, lastDocId, hasMore };
  }
};
