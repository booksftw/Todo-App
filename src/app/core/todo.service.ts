import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface TodoTable {
  firebaseId: string
  tableName: string
  tasks: TodoTask[]
}

export interface TodoTask {
  position: number
  task: string
  completed: boolean
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoTablesCollection: AngularFirestoreCollection<any>
  public todoTables: Observable<TodoTable[]>;

  constructor(private db: AngularFirestore) {
    console.log('SERVICE HERE')
    this.todoTablesCollection = this.db.collection('todoTables')

    // Shape and Extract Data
    this.todoTables = this.todoTablesCollection.snapshotChanges().pipe(
      map(e => {
        return e.map(el => {
          const payloadData = el.payload.doc.data()
          const position = payloadData.position
          const firebaseId = el.payload.doc.id
          return { firebaseId, ...payloadData }
        })
      })
    )
  }

  getAllTables(): Observable<TodoTable[]> {
    console.log('this todo tables', this.todoTables)
    return this.todoTables
  }

}
