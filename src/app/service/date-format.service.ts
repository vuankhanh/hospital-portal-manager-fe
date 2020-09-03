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

  fullTime(dateTime){
    let d = new Date(dateTime);

    let day = String("0"+d.getDate()).slice(-2);
    let month = String("0"+(d.getMonth()+1)).slice(-2);
    let year = d.getFullYear();

    let hour = String("0"+d.getHours()).slice(-2);
    let minute = String("0"+d.getMinutes()).slice(-2);
    let second = String("0"+d.getSeconds()).slice(-2);

    return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
  }
}
