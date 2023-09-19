import * as admin from 'firebase-admin'
import * as adminCreds from "./AdminCreds.json"
import { ServiceAccount } from 'firebase-admin'

const initializeAdminApp = () => {
  console.log("Firebase Admin app is being initialized...")
  const serviceAccount = require('./AdminCreds.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://food-map-grupp-6-default-rtdb.europe-west1.firebasedatabase.app/"
})

const uid = "user_uid"

return admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`Admin claim added to ${uid}`)
  });

}

export default initializeAdminApp;