import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

  constructor() { }

  originFormatDate(date){
    let d = new Date(date);
    // console.log(d.getMonth());

    let day = String("0"+d.getDate()).slice(-2);
    let month = String("0"+(d.getMonth()+1)).slice(-2);
    let year = d.getFullYear();

    return day+'/'+month+'/'+year;
  }

  formatDate(date){
    let d = new Date(date);
    // console.log(d.getMonth());

    let day = String("0"+d.getDate()).slice(-2);
    let month = String("0"+(d.getMonth()+1)).slice(-2);
    let year = d.getFullYear();

    return year+'-'+month+'-'+day;
  }

  previousDay(date){
    let d = new Date(date);
    d.setDate(d.getDate()-1);

    let day = String("0"+d.getDate()).slice(-2);
    let month = String("0"+(d.getMonth()+1)).slice(-2);
    let year = d.getFullYear();

    return year+'-'+month+'-'+day;
  }
}
