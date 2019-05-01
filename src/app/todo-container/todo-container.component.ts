import { Component, OnInit } from '@angular/core';
import { toArray, take } from 'rxjs/operators';
import { TodoService } from '../shared/todo.service';

@Component({
  selector: 'app-todo-container',
  templateUrl: './todo-container.component.html',
  styleUrls: ['./todo-container.component.scss']
})
export class TodoContainerComponent implements OnInit {
  itemsCollection
  constructor(
    private todoService: TodoService
  ) { }

  ngOnInit() {

    this.databaseStateSetupIntialView()
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
