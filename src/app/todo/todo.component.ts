import { Component, OnInit, AfterViewInit, ViewChildren, ViewChild, QueryList } from '@angular/core'
import {
	random as _random, remove as _remove, max as _max,
	includes as _includes, sortBy as _sortBy, each as _each, cloneDeep as _cloneDeep,
	orderBy as _orderby
} from 'lodash'
import { MatTableDataSource } from '@angular/material'
import { SelectionModel, DataSource } from '@angular/cdk/collections'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { map, filter, switchMap, mergeMap, take, toArray } from 'rxjs/operators'
import { Observable, Subscription } from 'rxjs';

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

	databaseStateSetupIntialView() {
		this.itemsCollection
			.valueChanges()
			.pipe(take(1))
			.pipe(toArray())
			.subscribe((t) => {
				console.log('database update view', t)
				// Intial Table Sorted Data 
				// TODO Update to get from table data object
				this.dataSource.data = _orderby(t[0], ['completed'], ['asc']);
				// Setup Intial Selected State
				this.dataSource.data.map((e, i) => {
					e.completed ? this.selection.select(this.dataSource.data[i]) : null
				})
			})
	}

	ngOnInit() {
		this.databaseStateSetupIntialView()
	}

	ngAfterViewInit() {
	}

	onTypeUpdateTodo(row: TodoTask) {
		// A View Child
		let todoTasks = this.todoTasks.toArray()
		// * Optimize this in the future
		const activeTaskValue = todoTasks.map(e => e.nativeElement)
			.filter(el => parseInt(el.id) === row.position)[0].innerText

		// Update DB
		const activeTaskFirebaseId = this.localItems.filter(el => el.position === row.position)
			.map(e => e.firebaseId)[0]


		this.itemsCollection.doc(activeTaskFirebaseId).update({ task: activeTaskValue })
	}

	onNewTaskSubmit() {
		const task = this.newTaskInput.nativeElement.value
		let newPositionId: number = _max(this.dataSource.data.map(t => t.position))
		const position: number = newPositionId + 1
		const newTaskObject = { position, task, completed: false }

		// Add new task to list
		const newListData = [newTaskObject, ...this.dataSource.data]

		// Add new task to DB
		this.itemsCollection.add(newTaskObject)

		// I need to add a new task to this specific table that it's coming from so maybe I can get the table id

		// Update App View
		this.dataSource.data = newListData

		// Reset input html element
		this.newTaskInput.nativeElement.value = ''
	}

	removeTask(element: TodoTask) {
		// Remove from view
		this.dataSource.data = this.dataSource.data.filter(e => e.position !== element.position)

		const removedItemFirebaseId = this.localItems.filter(el => el.position === element.position)[0].firebaseId
		// Remove From database
		this.itemsCollection.doc(removedItemFirebaseId).delete()
			.catch(err => console.log(err))
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

		// Update datasource
		const x = this.dataSource.data.filter(el => el.position === row.position)[0]
		x.completed = rowIsSelected

		this.dataSource.data = _orderby(this.dataSource.data, ['completed'], ['asc']);

		this.itemsCollection.doc(rowFirebaseId).update({ completed: rowIsSelected })
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: any): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`
	}

}
