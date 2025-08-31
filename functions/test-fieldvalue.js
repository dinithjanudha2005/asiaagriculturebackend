const admin = require("firebase-admin");

console.log("=== Testing Firebase Admin FieldValue ===");

// Check if Firebase Admin is loaded
console.log("1. Firebase Admin loaded:", !!admin);
console.log("2. Firebase Admin version:", admin.SDK_VERSION);

// Check if Firestore is available
console.log("3. Firestore available:", !!admin.firestore);

// Check if FieldValue is available
console.log("4. FieldValue available:", !!admin.firestore.FieldValue);

// Check if serverTimestamp is available
if (admin.firestore.FieldValue) {
  console.log("5. serverTimestamp available:", !!admin.firestore.FieldValue.serverTimestamp);
  
  if (admin.firestore.FieldValue.serverTimestamp) {
    try {
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      console.log("6. serverTimestamp() call successful:", !!timestamp);
      console.log("7. serverTimestamp type:", typeof timestamp);
    } catch (error) {
      console.error("6. serverTimestamp() call failed:", error.message);
    }
  }
} else {
  console.log("5. FieldValue is undefined");
}

// Try to initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  console.log("\n=== Attempting to initialize Firebase Admin ===");
  
  try {
    const serviceAccount = require("./keys/serviceAccountKey.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized successfully");
    
    // Check again after initialization
    console.log("\n=== After initialization ===");
    console.log("1. Firestore available:", !!admin.firestore);
    console.log("2. FieldValue available:", !!admin.firestore.FieldValue);
    
    if (admin.firestore.FieldValue) {
      console.log("3. serverTimestamp available:", !!admin.firestore.FieldValue.serverTimestamp);
      
      if (admin.firestore.FieldValue.serverTimestamp) {
        try {
          const timestamp = admin.firestore.FieldValue.serverTimestamp();
          console.log("4. serverTimestamp() call successful:", !!timestamp);
          console.log("5. serverTimestamp type:", typeof timestamp);
        } catch (error) {
          console.error("4. serverTimestamp() call failed:", error.message);
        }
      }
    }
    
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin:", error.message);
  }
} else {
  console.log("\n✅ Firebase Admin already initialized");
}

console.log("\n=== Test Complete ===");
