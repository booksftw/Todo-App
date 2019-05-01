import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTodoHost]'
})
export class TodoHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
