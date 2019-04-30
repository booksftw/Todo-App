import { Component, OnInit, AfterViewInit, ViewChildren, ViewChild, QueryList } from '@angular/core'
import {
	random as _random, remove as _remove, max as _max,
	includes as _includes, sortBy as _sortBy, each as _each, cloneDeep as _cloneDeep
} from 'lodash'
import { MatTableDataSource } from '@angular/material'
import { SelectionModel, DataSource } from '@angular/cdk/collections'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { map, filter, switchMap, mergeMap } from 'rxjs/operators'
import { Observable, Subscription } from 'rxjs';

export interface TodoTask {
	position: number
	task: string
	completed?: boolean
}

export interface CategoryTablePayloadContainer {
	firebaseId: string
	position: number
	task: TodoTask
}


let LIST_DATA: TodoTask[] = [
	{ position: 1, task: 'a task for the beach' },
	{ position: 2, task: 'a task for the beach' },
	{ position: 3, task: 'a task for the beach' },
	{ position: 4, task: 'a task for the beach' },
	{ position: 5, task: 'a task for the beach' },
	{ position: 6, task: 'a task for the beach' },
	{ position: 7, task: 'a task for the beach' },
	{ position: 8, task: 'a task for the beach' },
	{ position: 9, task: 'a task for the beach' },
	{ position: 10, task: 'a task for the beach' },
]

@Component({
	selector: 'app-todo',
	templateUrl: './todo.component.html',
	styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit, AfterViewInit {
	@ViewChildren('contentEditable') todoTasks: QueryList<any>
	@ViewChild('newTaskInput') newTaskInput: any
	@ViewChildren('positionRows') positionRows: QueryList<any>
	displayedColumns: string[] = ['select', 'position', 'task', 'remove']
	dataSource = new MatTableDataSource<TodoTask>()
	selection = new SelectionModel<any>(true)

	private itemsCollection: AngularFirestoreCollection<any>
	items: Subscription
	localItems: CategoryTablePayloadContainer[] = []

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
			.subscribe(console.log)
	}

	updateTaskFromDb(docId: number) {
		// Update the db
	}

	removeTaskFromDb(docId: number) {
		// Remove Task From Db
	}

	databaseStateSetupIntialView() {

		// Database Set Intial View
		this.itemsCollection.valueChanges().subscribe((t: TodoTask[]) => {
			console.log('database update view')
			// Intial Table Data
			this.dataSource.data = t
			// Setup Intial Selected State
			t.map((e, i) => {
				e.completed ? this.selection.select(this.dataSource.data[i]) : null
			})
		})
	}

	ngOnInit() {
		this.databaseStateSetupIntialView()
	}

	ngAfterViewInit() {
	}

	onTypeUpdateTodo(taskPositionId?) {
		let todoTasks = this.todoTasks.toArray()

		const activeTaskValue = todoTasks.map(el => el.nativeElement)
			.filter(el => parseInt(el.id) === taskPositionId)[0].innerText

		const listData = [...LIST_DATA]
		listData.filter(t => t.position === taskPositionId)[0].task = activeTaskValue

		// Save persistent data here

		// Update App View
		this.dataSource.data = listData
	}

	onNewTaskSubmit() {
		// ! NOT CONNECTED TO DATABASE HALF FUNCTIONAL

		const task = this.newTaskInput.nativeElement.value
		let newPositionId: number = _max(LIST_DATA.map(t => t.position))
		const position: number = newPositionId + 1
		const newTaskObject = { position, task }

		// Add new task to list
		// LIST_DATA = [newTaskObject, ...LIST_DATA]
		LIST_DATA = [newTaskObject, ...this.dataSource.data]

		// Todo: Save TO DB HERE

		// Update App View
		this.dataSource.data = LIST_DATA

		// Reset input html element
		this.newTaskInput.nativeElement.value = ''
	}

	removeTask(element: TodoTask) {
		console.log(element, 'element')
		this.dataSource.data = this.dataSource.data.filter(e => e.position !== element.position)
		console.log(this.dataSource.data, 'sss')
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection.selected.length
		const numRows = this.dataSource.data.length
		return numSelected === numRows
	}
	/** Selects all rows if they are not all selected otherwise clear selection. */
	masterToggle() {
		console.log('master toggle', this.isAllSelected)
		// this.isAllSelected() ?
		// 	this.selection.clear() :
		// 	this.dataSource.data.forEach(row => this.selection.select(row))
		let updateAllItemsCompleteState = (isComplete) => {
			// Update all documents
			this.localItems.map(el => {
				this.itemsCollection.doc(el.firebaseId).update({ completed: isComplete })
			})
		}

		if (this.isAllSelected()) {
			this.selection.clear()
			updateAllItemsCompleteState(false)
		} else {
			this.dataSource.data.forEach(row => this.selection.select(row))
			updateAllItemsCompleteState(true)
		}
	}

	isRowSelected(row) {
		// Init this selects the rows
		const rowIsSelected = this.selection.isSelected(row)
		return rowIsSelected
	}

	onCheckboxSelection(row) {
		const rowFirebaseId = this.localItems.filter(e => e.position === row.position)[0].firebaseId
		const rowIsSelected = this.selection.isSelected(row) // Value to update with  2
		console.log(this.localItems, ' local items ', row, 'row id>>>>', rowFirebaseId)

		this.itemsCollection.doc(rowFirebaseId).update({ completed: rowIsSelected })
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: any): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`
	}

	// removeIndex(index: number, data: any): any[] {
	// 	let newArr
	// 	newArr = data.filter((e) => e.position !== index)
	// 	// return newArr
	// }

}
