import { Component, OnInit, ViewChild, ComponentFactoryResolver, Type } from '@angular/core';
import { toArray, take } from 'rxjs/operators';
import { TodoService } from '../core/todo.service';
import { TodoHostDirective } from '../shared/todo-host.directive';
import { TodoPresentationComponent } from './todo-presentation/todo-presentation.component'
import { MatTableDataSource } from '@angular/material';

export interface TodoTableData {
  // Todo Update Interface
  tableData: any,
  localItems: any
}

@Component({
  selector: 'app-todo-container',
  templateUrl: './todo-container.component.html',
  styleUrls: ['./todo-container.component.scss']
})
export class TodoContainerComponent implements OnInit {
  @ViewChild(TodoHostDirective) todoHostContainer: TodoHostDirective
  itemsCollection
  constructor(
    private todoService: TodoService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }


  ngOnInit() {
    this.initTodoTableComponents()

    // this.todoService.getAllTodosTables()
    // Make local items in here with the collect
    // // this.todoService.getLocalItems()
  }
  initTodoTableComponents() {
    this.todoService.getAllTables()
      .subscribe(arr => {
        arr.map(table => {
          const { tasks } = table

        })

      })
  }
  renderTodoComponent(component: Type<TodoPresentationComponent>, data: TodoTableData) {
    console.log('dynamic generate factory test')
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component)
    let viewContainerRef = this.todoHostContainer.viewContainerRef
    const componentRef = viewContainerRef.createComponent(componentFactory)
    componentRef.instance.dataSource = new MatTableDataSource(data.tableData) // * Insert Intial data in there
    // componentRef.instance.dataSource.data = data.tableData
    componentRef.instance.localItems = data.localItems
  }

  databaseStateSetupIntialView() {
    // The intial database data setup
    // Get it here and pass it to property in presentation
    // Pass this observable into the presentation object and it'll subscribe on the inside. Don't forget to unsubscribe.
    // this.itemsCollection
    //   .valueChanges()
    //   .pipe(take(1))
    //   .pipe(toArray())
    //* Subscribe in child component
    // .subscribe((t) => {
    //   console.log('database update view', t)
    //   // Intial Table Sorted Data 
    //   // TODO Update to get from table data object
    //   this.dataSource.data = _orderby(t[0], ['completed'], ['asc']);
    //   // Setup Intial Selected State
    //   this.dataSource.data.map((e, i) => {
    //     e.completed ? this.selection.select(this.dataSource.data[i]) : null
    //   })
    // })
  }
}
