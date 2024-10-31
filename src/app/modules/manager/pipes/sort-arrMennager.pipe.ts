import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortArrManager'
})
export class SortArrPipeManager implements PipeTransform {
  transform(value: any[], ...args: string[]): any[] {
    if (value == null) {
      return;
    }
    value.sort((a, b) => (a[args[0]] > b[args[0]]) ? 1 : -1)
    return value;
  }

}
