import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseService {
  _firebaseApp: app.App;
  // db: FirebaseFirestore.Firestore;
  // collection: FirebaseFirestore.CollectionReference;

  constructor(@Inject('FIREBASE_APP') private app: app.App) {
    this._firebaseApp = app;
    // this.#db = firebaseApp.firestore();
    // this.#collection = this.#db.collection('<collection_name>');
    // this.bucket = this.firebaseApp.storage().bucket();
    // const bucket = this.firebaseApp.storage().bucket();
  }

  get firebaseApp(): app.App {
    return this._firebaseApp;
  }
}
