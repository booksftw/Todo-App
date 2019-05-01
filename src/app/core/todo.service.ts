import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface TodoTable {
  tableFirebaseId: string
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
  public todoTables$: Observable<TodoTable[]>;

  constructor(private db: AngularFirestore) {
    console.log('SERVICE HERE')
    this.todoTablesCollection = this.db.collection('todoTables')

    // Shape and Extract Data
    this.todoTables$ = this.todoTablesCollection.snapshotChanges().pipe(
      map(el => {
        return el.map(t => {
          const payloadData = t.payload.doc.data()
          const tableFirebaseId = t.payload.doc.id
          return { tableFirebaseId, ...payloadData }
        })
      })
    )
  }

  getAllTables(): Observable<TodoTable[]> {
    return this.todoTables$
  }

}
