import { Pipe, PipeTransform } from '@angular/core';
import { History } from 'src/app/types/history';
@Pipe({
  name: 'total'
})
export class TotalPipe implements PipeTransform {

  transform(value: History[], ...args: unknown[]): number {
    if (value == null) {
      return null;
    };
    let count: number = 0;


   

    for (let i = 0; i < value.length; i++)
    {
      count += value[i].revenues - value[i].expenses;
    }
    
    return count;
  }
}
