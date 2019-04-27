import { Component, OnInit, AfterViewInit } from '@angular/core';
import { random as _random, remove as _remove } from 'lodash'
import { MatTableDataSource } from '@angular/material';

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

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit, AfterViewInit {
  // Array of list items

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource() //ELEMENT_DATA;

  removeIndex(index: number, data: any): PeriodicElement[] {
    let newArr;
    newArr = data.filter((e) => e.position !== index)
    console.log(newArr, index, 'newArr')
    // const newArr = ELEMENT_DATA.splice(index, 1)
    // ELEMENT_DATA = newArr
    // console.log(index, ELEMENT_DATA)
    return newArr
  }

  ngAfterViewInit() {
    setInterval(_ => {
      this.dataSource.data = this.removeIndex(_random(0, ELEMENT_DATA.length - 1), ELEMENT_DATA)
    }, 4000)
    // ELEMENT_DATA.push({ position: 11, name: 'Neon', weight: 20.1797, symbol: 'Ne' })
    // this.dataSource._update
    // let i = 0
    // setInterval(_ => {
    //   ELEMENT_DATA = this.removeIndex(i)
    //   console.log(ELEMENT_DATA)
    // }, 1000)
  }

  ngOnInit() {
  }

}
