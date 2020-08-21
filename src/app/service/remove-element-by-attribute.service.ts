import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RemoveElementByAttributeService {

  constructor() { }

  removeByAttr(arr, attr, value){
    let i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    return arr;
  }
}
