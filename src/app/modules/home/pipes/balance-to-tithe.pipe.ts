import { Pipe, PipeTransform } from '@angular/core';
import { Tithe } from 'src/app/types/tithe';

@Pipe({
  name: 'balanceToTithe'
})
export class BalanceToTithePipe implements PipeTransform {

  transform(value: Tithe, ...args: unknown[]): number {
    if (value == null) {
      return null;
    };
  return ((value.revenuesToTithe/10) - value.expensesToTithe);
  }

}
