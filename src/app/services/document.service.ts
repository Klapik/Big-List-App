import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private db: AngularFirestore) {

  }

  deleteDocument(id: string) {
    return this.db.doc(`documents/${id}`).delete().then(() => {
    });
  }
}
