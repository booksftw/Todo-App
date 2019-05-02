import { Component, OnInit, ViewChild, ComponentFactoryResolver, Type, ElementRef } from '@angular/core';
import { TodoService, TodoTask, TodoTable } from '../core/todo.service';
import { TodoHostDirective } from '../shared/todo-host.directive';
import { TodoPresentationComponent } from './todo-presentation/todo-presentation.component'
import { MatTableDataSource } from '@angular/material';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-todo-container',
  templateUrl: './todo-container.component.html',
  styleUrls: ['./todo-container.component.scss']
})
export class TodoContainerComponent implements OnInit {
  @ViewChild(TodoHostDirective) todoHostContainer: TodoHostDirective
  @ViewChild('newCategoryNameInput') newCategoryNameInput

  constructor(
    private todoService: TodoService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.initTodoTableComponents()
  }

  initTodoTableComponents() {
    this.todoService.getAllTables()
      .pipe(
        take(1)
      )
      .subscribe(arr => {
        arr.map(table => {
          const tableData: TodoTable = table
          this.renderTodoComponent(TodoPresentationComponent, tableData)
        })

      })
  }

  renderTodoComponent(component: Type<TodoPresentationComponent>, data: TodoTable) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component)
    let viewContainerRef = this.todoHostContainer.viewContainerRef
    const componentRef = viewContainerRef.createComponent(componentFactory)
    componentRef.instance.dataSource = new MatTableDataSource(data.tasks) // * Insert Intial data in there
    componentRef.instance.tableFirebaseId = data.tableFirebaseId
    componentRef.instance.tableName = data.tableName

    componentRef.instance.updateTaskCompleteState.subscribe(tableData => {
      this.updateTodoTableInDatabase(tableData, 'update')
    })
    componentRef.instance.addNewTask.subscribe(tableData => {
      this.updateTodoTableInDatabase(tableData, 'add')
    })
    componentRef.instance.removeTaskDB.subscribe(tableData => {
      console.log('CONTAINER REMOVE FROM DB', tableData)
      this.updateTodoTableInDatabase(tableData, 'remove')
    })
  }

  updateTodoTableInDatabase(data, method) {
    console.log('CONTAINER', data)
    const { tableDocId, tableName, newTaskDataSource } = data
    console.log('data stuff', tableDocId, tableName, newTaskDataSource)
    this.todoService.updateTableData(tableDocId, tableName, newTaskDataSource, method)
  }


  addNewTodoTable() {
    // export interface TodoTable {
    //   tableFirebaseId?: string
    //   tableName: string
    //   tasks: TodoTask[]
    // }
    const newTableCategoryName = this.newCategoryNameInput.nativeElement.value
    const data = { tableName: newTableCategoryName, tasks: [] }
    this.renderTodoComponent(TodoPresentationComponent, data)

    this.todoService.addTodoTable(data)
  }
}
