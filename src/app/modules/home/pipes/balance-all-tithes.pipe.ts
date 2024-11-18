import { Pipe, PipeTransform } from '@angular/core';
import { Tithe } from 'src/app/types/tithe';

@Pipe({
  name: 'balanceAllTithes'
})
export class BalanceAllTithesPipe implements PipeTransform {

  transform(value: Tithe[], ...args: unknown[]): number {
    if (value == null) {
      return null;
    };
    let count: number = 0;



    for (let i = 0; i < value.length; i++)
    {
      count +=(value[i].revenuesToTithe/10)  - value[i].expensesToTithe;
    }
    
    return count;
  }
}
