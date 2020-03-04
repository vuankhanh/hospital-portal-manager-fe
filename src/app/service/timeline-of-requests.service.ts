import { Injectable } from '@angular/core';

import { WebsocketService } from './api/websocket.service';

import { ListTicketsService } from './list-tickets.service';

import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map } from 'rxjs/operators'
export interface Timer{
  minutes: number;
  seconds: number;
}

export interface IInterval {
  days: number;
  hours: number;
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
  constructor(
    private webSocketService: WebsocketService,
    private listTicketsService: ListTicketsService
  ) {
    
  }

  listentWebSocket(){
    this.webSocketService.listenWebSocket().subscribe(res=>{
      let socketData = JSON.parse(res);
      console.log(socketData);
      this.listTicketsService.changePropertyTicket(socketData);
    })
  }

  calcCountdown(duration: number, createdCases: string){
    let createdCase = new Date(createdCases);
    let serverTime = new Date();
    let timeRemaining = this.pipeDurationToMinutes(duration) + createdCase.getTime() - serverTime.getTime();

    return new Observable(observer=>{
      let x = setInterval(()=>{
        timeRemaining -= 1000;
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        let countDownTimer = { minutes: minutes, seconds: seconds }

        if (timeRemaining <= 0) {
          countDownTimer = { minutes: -1, seconds: -1 };
          clearInterval(x);
        }
        observer.next(countDownTimer)
      },1000);
    })
  }

  pipeDurationToMinutes(duration: number){
    return duration *60*1000;
  }
}
