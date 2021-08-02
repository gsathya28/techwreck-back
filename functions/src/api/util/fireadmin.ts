import * as admin from 'firebase-admin'
// @ts-expect-error
import servAccount from '../keys/firebase_servkey'

export const fireAdmin = admin.initializeApp({
  credential: admin.credential.cert(servAccount)
})
