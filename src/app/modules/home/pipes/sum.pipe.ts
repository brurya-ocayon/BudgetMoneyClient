import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {

  transform(value: any[], ...args: unknown[]): number {
    let sum: number = 0;
    if (value == null || value.length == 0) {
      return null;
    }
    for (let i of value) {
      if (i.sum != null && i.isActive) {
        sum += i.sum;
      }
     
    }
    return sum;
  }

}
