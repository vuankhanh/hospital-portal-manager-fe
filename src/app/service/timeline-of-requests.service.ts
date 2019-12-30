import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Timer{
  minutes: number;
  seconds: number;
}

export interface RefundRequest{
  name:string;
  value: number;
  note:string;
}
@Injectable({
  providedIn: 'root'
})
export class TimelineOfRequestsService {
  requestsURL: string = 'assets/mock-data/fake-data-server/history-directbilling.json';

  listenCountdown$: BehaviorSubject<Timer> = new BehaviorSubject<Timer>(null);
  listenCountPending$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
    private httpClient: HttpClient
  ) {
    this.fakeCountdown().subscribe(timer=>{
      this.listenCountdown$.next(timer);
    });
  }

  historyDirectBilling(){
    return this.httpClient.get(this.requestsURL);
  }

  fakeCountdown():Observable<Timer>{
    let countdown = new Date();
    countdown.setMinutes(countdown.getMinutes()+6);
    // countdown.setSeconds(countdown.getSeconds()+10);

    return new Observable(observer=>{
      let x = setInterval(()=>{
        var now = new Date().getTime();
  
        // Find the distance between now and the count down date
        var distance = countdown.getTime() - now;
  
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        let countDownTimer = { minutes: minutes, seconds: seconds }
        
        if (distance < 0) {
          countDownTimer = { minutes: -1, seconds: -1 };
          clearInterval(x);
        }
        observer.next(countDownTimer)
      },1000);
    })
  }

  returnPending(historyDirectBilling:any):number{
    return historyDirectBilling.filter(historyDirectBilling=>historyDirectBilling.status==='pending').length;
  }
}
