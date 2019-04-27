import { Component, OnInit, AfterViewInit } from '@angular/core';
import { random as _random, remove as _remove } from 'lodash'
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
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

let LIST_DATA: any = [
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
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<any>(LIST_DATA);
  selection = new SelectionModel<any>(true, []);

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

  nzClick() {
    console.log('nz click')
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

  ngAfterViewInit() {
    setTimeout(_ => console.log(this.checkboxLabel()), 3000)
    // setInterval(_ => {
    //   this.dataSource.data = this.removeIndex(_random(0, ELEMENT_DATA.length - 1), ELEMENT_DATA)
    // }, 4000)
  }

  ngOnInit() {
  }

}
