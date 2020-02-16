import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListTicketsService {
  listTickets:any= [];

  listTicket$:BehaviorSubject<any> = new BehaviorSubject<any>(this.listTickets);
  listenListTicket: Observable<any> = this.listTicket$.asObservable();

  constructor(
  ) {}

  getAll(listTickets){
    let jsonListkets = [];

    for(let ticket of listTickets){
      ticket.files = JSON.parse(ticket.files);
      ticket.costs = JSON.parse(ticket.costs);

      jsonListkets.push(ticket);
    }

    this.listTickets = jsonListkets;
    this.listTicket$.next(this.listTickets);
  }

  changePropertyTicket(ticket){
    let checkExistTicket: boolean;

    ticket.files = JSON.parse(ticket.files);
    ticket.costs = JSON.parse(ticket.costs);

    for(let i=0; i<this.listTickets.length;i++){
      if(this.listTickets[i].ID === ticket.ID){
        checkExistTicket=true;
        this.listTickets[i] = ticket;
      }
    }

    if(!checkExistTicket){
      this.listTickets.push(ticket);
    }

    this.listTicket$.next(this.listTickets);
  }
}
