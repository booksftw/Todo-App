import { Component, OnInit, AfterViewInit, ViewChildren, ViewChild, QueryList } from '@angular/core'
import {
	random as _random, remove as _remove, max as _max,
	includes as _includes, sortBy as _sortBy, each as _each, cloneDeep as _cloneDeep
} from 'lodash'
import { MatTableDataSource } from '@angular/material'
import { SelectionModel, DataSource } from '@angular/cdk/collections'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { map } from 'rxjs/operators'
import { Observable, Subscription } from 'rxjs';

export interface TodoTask {
	position: number
	task: string
	completed?: boolean
}

export interface CategoryTablePayloadContainer {
	firebaseId: string
	positionId: number
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
	// dataSource = new MatTableDataSource<TodoTask>(LIST_DATA)
	dataSource = new MatTableDataSource<TodoTask>()
	selection = new SelectionModel<any>(true, [])

	private itemsCollection: AngularFirestoreCollection<any>
	items: Observable<CategoryTablePayloadContainer[][]>;
	// items: Subscription<CategoryTablePayloadContainer[][]>;

	constructor(private db: AngularFirestore) {
		this.itemsCollection = this.db.collection('categoryTable')

		// Subscription here for personal note - remove in production
		this.items = this.itemsCollection.snapshotChanges().pipe(
			map(e => {
				return e.map(el => {
					const payloadData = el.payload.doc.data()
					const position = payloadData.position
					const id = el.payload.doc.id
					return [id, position, ...payloadData]
				})
			})
		)
		// .subscribe(console.log)
	}

	updateTaskFromDb(docId: number) {
		// Update the db
	}

	removeTaskFromDb(docId: number) {
		// Remove Task From Db
	}

	ngOnInit() {

		// !Left off here
		// * You have the data coming from the database.
		// * Now you need to get the document ids and update and add and remove properly from the db.
		// * You'll probably have to make the incoming data the immutable data instead of the LIST_DATA
		this.itemsCollection.valueChanges().subscribe((t: TodoTask[]) => {
			this.dataSource.data = t
		})

		// this.addTaskToDB()
		// this.itemsCollection.snapshotChanges()
		// 	.subscribe(docs => {
		// 		docs.map(el => {
		// 			// console.log('el', el.payload.doc.data())
		// 		})
		// 	})
	}

	ngAfterViewInit() {
		// setTimeout(_ => console.log(this.items), 3000)
	}

	onTypeUpdateTodo(taskPositionId?) {
		let todoTasks = this.todoTasks.toArray()
		// The task that is being typed in
		const activeTaskValue = todoTasks.map(el => el.nativeElement)
			.filter(el => parseInt(el.id) === taskPositionId)[0].innerText

		// Replace the activeTaskValue with the oldArray and give it the new array
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

	removeTask(elPosition: number) {
		// console.log('remove task', elPosition)
		const listData = [...LIST_DATA]
		LIST_DATA = listData.filter(t => {
			return t.position !== elPosition
		})

		//Save persistent data here

		// Update App View
		this.dataSource.data = LIST_DATA
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection.selected.length
		const numRows = this.dataSource.data.length
		return numSelected === numRows
	}
	/** Selects all rows if they are not all selected otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => this.selection.select(row))
	}

	onRowSelection(row) {
		// Fires everytime the checkbox is clicked

		const selectedElements: TodoTask[] = this.selection.selected
		const selectedElementsPosition: number[] = selectedElements.map(el => el.position)

		// Is row in selectedElementsPosition
		const rowPositionId: number = row.position
		const rowIsSelected: boolean = _includes(selectedElementsPosition, rowPositionId)

		// update view:
		this.dataSource.data.map(t => {
			const rowMatches = rowPositionId === t.position
			rowMatches && rowIsSelected ? t.completed = true : t.completed = false
			return t
		})

		// Todo: Get the id from items observable and then use it in this inner observable to
		// * identify the doc and then update.

		// update db:
		this.itemsCollection.doc('2TKsU5klUAc8UPvt58in').update({ task: 'UPDATE SUCCESS' })

		// Fix the static typing
	}


	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: any): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`
	}

	removeIndex(index: number, data: any): any[] {
		let newArr
		newArr = data.filter((e) => e.position !== index)
		return newArr
	}

}
