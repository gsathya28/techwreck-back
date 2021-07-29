import * as admin from "firebase-admin";
let servAccount = require("../keys/firebase_servkey.json");

export const fireAdmin = admin.initializeApp({
  credential: admin.credential.cert(servAccount),
});
