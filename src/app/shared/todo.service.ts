import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export interface TodoTask {
  position: number
  task: string
  completed: boolean
}

export interface CategoryTablePayloadContainer {
  firebaseId: string
  position: number
  task: TodoTask
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  items // Observable <SOMETHING>
  localItems: CategoryTablePayloadContainer[] = []

  private itemsCollection: AngularFirestoreCollection<any>

  constructor(private db: AngularFirestore) {
    this.itemsCollection = this.db.collection('categoryTable')
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map(e => {
        return e.map(el => {
          const payloadData = el.payload.doc.data()
          const position = payloadData.position
          const firebaseId = el.payload.doc.id
          this.localItems.push({ firebaseId, position, ...payloadData })
          return { firebaseId, position, ...payloadData }
        })
      })
    )
    // .subscribe(console.log)
  }
}
