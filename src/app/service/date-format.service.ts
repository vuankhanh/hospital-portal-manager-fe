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

  formatToday(){
    let d = new Date();

    let day = String("0"+d.getDate()).slice(-2);
    let month = String("0"+(d.getMonth()+1)).slice(-2);
    let year = d.getFullYear();
    
    return year+'-'+month+'-'+day;
  }

  changeStringDate(date:string){
    let element = date.split('/');

    let day = String("0"+element[0]).slice(-2);
    let month = String("0"+element[1]).slice(-2);
    let year = element[2];

    return year+'-'+month+'-'+day;
  }
}
