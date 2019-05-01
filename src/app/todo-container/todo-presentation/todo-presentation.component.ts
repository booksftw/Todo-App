import { Component, OnInit, ViewChildren, ViewChild, QueryList } from '@angular/core';
import { TodoTask } from 'src/app/core/todo.service';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-todo-presentation',
  templateUrl: './todo-presentation.component.html',
  styleUrls: ['./todo-presentation.component.scss']
})
export class TodoPresentationComponent implements OnInit {

  @ViewChildren('contentEditable') todoTasks: QueryList<any>
  @ViewChild('newTaskInput') newTaskInput: any
  @ViewChildren('positionRows') positionRows: QueryList<any>
  displayedColumns: string[] = ['select', 'position', 'task', 'remove']
  // dataSource = new MatTableDataSource<TodoTask>()
  dataSource: MatTableDataSource<TodoTask>
  localItems: any // Todo Update this type
  selection = new SelectionModel<any>(true)

  tableName: string
  firebaseId: string

  constructor() { }

  ngOnInit() { }

  onTypeUpdateTodo(row: TodoTask) {
    //   // A View Child
    //   let todoTasks = this.todoTasks.toArray()
    //   // * Optimize this in the future
    //   const activeTaskValue = todoTasks.map(e => e.nativeElement)
    //     .filter(el => parseInt(el.id) === row.position)[0].innerText

    //   // Update DB
    //   const activeTaskFirebaseId = this.localItems.filter(el => el.position === row.position)
    //     .map(e => e.firebaseId)[0]


    //   this.itemsCollection.doc(activeTaskFirebaseId).update({ task: activeTaskValue })
  }

  onNewTaskSubmit() {
    //   const task = this.newTaskInput.nativeElement.value
    //   let newPositionId: number = _max(this.dataSource.data.map(t => t.position))
    //   const position: number = newPositionId + 1
    //   const newTaskObject = { position, task, completed: false }

    //   // Add new task to list
    //   const newListData = [newTaskObject, ...this.dataSource.data]

    //   // Add new task to DB
    //   this.itemsCollection.add(newTaskObject)

    //   // Update App View
    //   this.dataSource.data = newListData

    //   // Reset input html element
    //   this.newTaskInput.nativeElement.value = ''
  }

  removeTask(element: TodoTask) {
    //   // Remove from view
    //   this.dataSource.data = this.dataSource.data.filter(e => e.position !== element.position)

    //   const removedItemFirebaseId = this.localItems.filter(el => el.position === element.position)[0].firebaseId
    //   // Remove From database
    //   this.itemsCollection.doc(removedItemFirebaseId).delete()
    //     .catch(err => console.log(err))
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  masterToggle() {
    // let updateAllItemsCompleteState = (isComplete) => {
    //   // Update all documents
    //   this.localItems.map(el => {
    //     this.itemsCollection.doc(el.firebaseId).update({ completed: isComplete })
    //   })
    // }

    // if (this.isAllSelected()) {
    //   this.selection.clear()
    //   updateAllItemsCompleteState(false)
    // } else {
    //   this.dataSource.data.forEach(row => this.selection.select(row))
    //   updateAllItemsCompleteState(true)
    // }
  }

  isRowSelected(row) {
    // Init this selects the rows
    const rowIsSelected = this.selection.isSelected(row)
    return rowIsSelected
  }

  onCheckboxSelection(row) {
    // const rowFirebaseId = this.localItems.filter(e => e.position === row.position)[0].firebaseId
    // const rowIsSelected = this.selection.isSelected(row) // Value to update with  2

    // // Update datasource
    // const x = this.dataSource.data.filter(el => el.position === row.position)[0]
    // x.completed = rowIsSelected

    // this.dataSource.data = _orderby(this.dataSource.data, ['completed'], ['asc']);

    // this.itemsCollection.doc(rowFirebaseId).update({ completed: rowIsSelected })
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`
    // return 'true'
  }
}
