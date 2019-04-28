import { Component, OnInit, AfterViewInit, ViewChildren, ViewChild, ContentChild, ContentChildren, QueryList, ElementRef } from '@angular/core';
import { random as _random, remove as _remove, max as _max, includes as _includes, sortBy as _sortBy, each as _each } from 'lodash'
import { MatTableDataSource } from '@angular/material';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

export interface PeriodicElement {
	name: string;
	position: number;
	weight: number;
	symbol: string;
}

export interface TodoTask {
	position: number
	task: string
	completed?: boolean
}

let ELEMENT_DATA: any = [
	{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
	{ position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
	{ position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
	{ position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
	{ position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
	{ position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
	{ position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
	{ position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
	{ position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
	{ position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

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
	@ViewChild('newTaskInput') newTaskInput: any;
	@ViewChildren('positionRows') positionRows: QueryList<any>;
	displayedColumns: string[] = ['select', 'position', 'task', 'remove'];
	// dataSource = new MatTableDataSource<TodoTask>(LIST_DATA);
	dataSource = new MatTableDataSource<TodoTask>();
	selection = new SelectionModel<any>(true, []);

	private itemsCollection: AngularFirestoreCollection<any>;


	constructor(private db: AngularFirestore) {
	}

	addTaskToDB() {
		// const newTask: TodoTask = { position: 2, task: 'a task for the beach' }
		// LIST_DATA.forEach(t => this.itemsCollection.add(newTask))
		// USE THE UPDATED VIEW METHODS AND IMPLEMENT THE DB 
	}

	updateTaskFromDb(docId: number) {
		// Update the db
	}

	removeTaskFromDb(docId: number) {
		// Remove Task From Db
	}

	ngOnInit() {
		this.itemsCollection = this.db.collection('categoryTable')

		// !Left off here
		// * You have the data coming from the database.
		// * Now you need to get the document ids and update and add and remove properly from the db.
		// * You'll probably have to make the incoming data the immutable data instead of the LIST_DATA
		this.itemsCollection.valueChanges().subscribe((t: TodoTask[]) => {
			console.log(t)
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
		const task = this.newTaskInput.nativeElement.value
		let newPositionId: number = _max(LIST_DATA.map(t => t.position))
		const position: number = newPositionId + 1
		const newTaskObject = { position, task }

		// Add new task to list
		// LIST_DATA = [newTaskObject, ...LIST_DATA]
		LIST_DATA = [newTaskObject, ...this.dataSource.data]

		// Todo: Save TO DB HERE

		// Update App View
		this.dataSource.data = LIST_DATA;

		// Reset input
		this.newTaskInput.nativeElement.value = ''
	}

	removeTask(elPosition: number) {
		console.log('remove task', elPosition)
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
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}
	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => this.selection.select(row));
	}

	onRowSelection(row) {
		console.log('row e', row)
		// Fires everytime the checkbox is clicked

		const selectedElements: TodoTask[] = this.selection.selected
		const selectedElementsPosition: number[] = selectedElements.map(el => el.position)

		// Is row in selectedElementsPosition
		const rowPositionId: number = row.position;
		const rowIsSelected: boolean = _includes(selectedElementsPosition, rowPositionId)


		// update view:
		// this.dataSource.data = new

		// update db:
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: any): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
	}

	removeIndex(index: number, data: any): PeriodicElement[] {
		let newArr;
		newArr = data.filter((e) => e.position !== index)
		return newArr
	}

}
