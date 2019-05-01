import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface TodoTable {
  tableFirebaseId?: string
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

  updateTaskComplete(tableDocId: string, tableName: string, newTaskDataSource: TodoTask[]) {
    // Replace the entire task array with new one
    console.log('SERVICE', tableDocId, tableName, newTaskDataSource)
    // this.todoTablesCollection.doc(tableDocId).update({ tasks: newTaskDataSource })
    const updatedTableData: TodoTable = { tableName: tableName, tasks: newTaskDataSource }
    this.todoTablesCollection.doc(tableDocId).set(updatedTableData)
      .then(e => console.log(e))
      .catch(err => console.log(err))
  }
}
