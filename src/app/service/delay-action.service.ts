import { Injectable } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DelayActionService {
  value: number = 100;
  constructor() {}

  countDown(){
    return interval(250).pipe(
      map(_=>{
        this.value -= 2.5;
        return this.value;
      }), take(40)
    );
  }

  promise(){
    return new Promise<boolean>((resolve, reject)=>{
    })
  }
}
