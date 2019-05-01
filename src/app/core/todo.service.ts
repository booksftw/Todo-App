import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, take, toArray } from 'rxjs/operators';
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

// `export interface todoTablePayload {
//   firebaseId: string
//   // position: number
//   task: TodoTask
// }`

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // localTodoTable: CategoryTablePayloadContainer[] = []
  // Todo Update Type
  public todoTables: any;
  private todoTablesCollection: AngularFirestoreCollection<any>

  constructor(private db: AngularFirestore) {
    console.log('SERVICE HERE')
    this.todoTablesCollection = this.db.collection('todoTables')
    // Init local state
    this.todoTables = this.todoTablesCollection.snapshotChanges().pipe(
      map(e => {
        return e.map(el => {
          const payloadData = el.payload.doc.data()
          const position = payloadData.position
          const firebaseId = el.payload.doc.id
          // this.localTodoTable.push({ firebaseId, ...payloadData })
          return { firebaseId, ...payloadData }
        })
      })
    )
    // .subscribe(console.log)
  }
  getAllTables(): Observable<TodoTable[]> {
    console.log('this todo tables', this.todoTables)
    return this.todoTables
  }

  // Todo remove depercated
  // getSingleItemCollectionForInit(): Observable<any> {
  //   const allTodoTablesFiredOnce: Observable<any> = this.todoTablesCollection
  //     .valueChanges()
  //     .pipe(toArray())
  //     .pipe(take(1))
  //   return allTodoTablesFiredOnce
  // }

  // getAllLocalTodoTablesPayload(): CategoryTablePayloadContainer[] {
  //   return this.localTodoTable
  // }
}
