import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordinalDate'
})
export class OrdinalDatePipe implements PipeTransform {
  transform(value: any): any {
    if (!value) {
      return '';
    }
   //let months= ["January","February","March","April","May","June","July",           "August","September","October","November","December"]
    return `${value}${this.nth(parseInt(value))}`;
  }

 nth(d:any) {
  if (d > 3 && d < 21) return 'th'; 
  switch (d % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}
}