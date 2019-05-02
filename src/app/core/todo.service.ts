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
  updateTableData(tableDocId: string, tableName: string, newTaskDataSource: TodoTask[], crudMethod: string) {
    switch (crudMethod) {
      case 'add':
        console.log('adding to firebase', tableDocId, tableName, newTaskDataSource)
        const updatedAddTableData: TodoTable = { tableName: tableName, tasks: newTaskDataSource }
        this.todoTablesCollection.doc(tableDocId).set(updatedAddTableData)
          .catch(err => console.log(err))
        break;
      case 'update':
        const updatedUpdateTableData: TodoTable = { tableName: tableName, tasks: newTaskDataSource }
        this.todoTablesCollection.doc(tableDocId).set(updatedUpdateTableData)
          .catch(err => console.log(err))
        break;
      case 'remove':
        console.log('remove from firebase', tableDocId, tableName, newTaskDataSource)
        const updatedRemoveTableData: TodoTable = { tableName: tableName, tasks: newTaskDataSource }
        this.todoTablesCollection.doc(tableDocId).set(updatedRemoveTableData)
          .catch(err => console.log(err))
        break;
      default:
        console.error("ERROR CRUD OPERATION NOT WORKING")
        break;
    }
  }

  addTodoTable(todoTableData: TodoTable) {
    this.todoTablesCollection.add(todoTableData)
  }
}


// updateTaskComplete(tableDocId: string, tableName: string, newTaskDataSource: TodoTask[]) {
//   //   // Replace the entire task array with new one
//   //   console.log('SERVICE', tableDocId, tableName, newTaskDataSource)
//   //   // this.todoTablesCollection.doc(tableDocId).update({ tasks: newTaskDataSource })
//   //   const updatedTableData: TodoTable = { tableName: tableName, tasks: newTaskDataSource }
//   //   this.todoTablesCollection.doc(tableDocId).set(updatedTableData)
//   //     .then(e => console.log(e))
//   //     .catch(err => console.log(err))
//   // }
// }
