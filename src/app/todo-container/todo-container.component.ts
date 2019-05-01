import { Component, OnInit, ViewChild, ComponentFactoryResolver, Type } from '@angular/core';
import { TodoService, TodoTask } from '../core/todo.service';
import { TodoHostDirective } from '../shared/todo-host.directive';
import { TodoPresentationComponent } from './todo-presentation/todo-presentation.component'
import { MatTableDataSource } from '@angular/material';

export interface TodoTableData {
  firebaseId: string,
  tableName: string,
  tasks: TodoTask[]
}

@Component({
  selector: 'app-todo-container',
  templateUrl: './todo-container.component.html',
  styleUrls: ['./todo-container.component.scss']
})
export class TodoContainerComponent implements OnInit {
  @ViewChild(TodoHostDirective) todoHostContainer: TodoHostDirective

  constructor(
    private todoService: TodoService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.initTodoTableComponents()
  }

  initTodoTableComponents() {
    console.log('howdy')
    this.todoService.getAllTables()
      .subscribe(arr => {
        console.log(arr)
        arr.map(table => {
          const tableData: TodoTableData = table
          this.renderTodoComponent(TodoPresentationComponent, tableData)
        })

      })
  }

  renderTodoComponent(component: Type<TodoPresentationComponent>, data: TodoTableData) {
    console.log('dynamic generate factory test')
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component)
    let viewContainerRef = this.todoHostContainer.viewContainerRef
    const componentRef = viewContainerRef.createComponent(componentFactory)
    componentRef.instance.dataSource = new MatTableDataSource(data.tasks) // * Insert Intial data in there
    componentRef.instance.firebaseId = data.firebaseId
    componentRef.instance.tableName = data.tableName
  }

}
