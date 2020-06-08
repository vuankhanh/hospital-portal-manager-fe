import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nextDay'
})
export class NextDayPipe implements PipeTransform {

  transform(value: string): Date {
    let newDate = new Date(value);
    newDate.setDate(newDate.getDate()+1);
    return newDate;
  }

}
