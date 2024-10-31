import { Pipe, PipeTransform } from '@angular/core';
import { FORMERR } from 'dns';
import { History } from 'src/app/types/history';


@Pipe({
  name: 'balanceCalculation'
})
export class BalanceCalculationPipe implements PipeTransform {

  transform(value: History, ...args: unknown[]): number {
    if (value == null) {
      return null;
    };
    
    return (value.revenues - value.expenses);





  }

}
