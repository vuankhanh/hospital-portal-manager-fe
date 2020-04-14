import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material';

import { LocalStorageService } from './local-storage.service';
import { ListTicketService } from './api/get/list-ticket.service';
import { NotificationService } from './notification.service';

import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ListTicketsService {
  takenTickets:any;
  openTickets:any;
  historyTickets: any;

  listenCommentTicket$:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listenCommentTicket: Observable<any> = this.listenCommentTicket$.asObservable();

  //234234
  listenDirectBillingTaken$:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listenDirectBillingTaken: Observable<any> = this.listenDirectBillingTaken$.asObservable();

  listenTicketsOpen$:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listenTicketsOpen: Observable<any> = this.listenTicketsOpen$.asObservable();

  listenTicketsHistory$:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listenTicketsHistory: Observable<any> = this.listenTicketsHistory$.asObservable();
  constructor(
    private dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private listTicketService: ListTicketService,
    private notificationService: NotificationService
  ) {
    
  }

  getDirectBillingTaken(response){

    for(let ticket of response.data){
      ticket.files = JSON.parse(ticket.files);
      ticket.costs = JSON.parse(ticket.costs);
    }
    this.takenTickets = response;

    this.listenDirectBillingTaken$.next(this.takenTickets);
  }
  
  getTicketsOpen(response){
    for(let ticket of response.data){
      ticket.files = JSON.parse(ticket.files);
      ticket.costs = JSON.parse(ticket.costs);
    }
    this.openTickets = response;

    this.listenTicketsOpen$.next(this.openTickets);
  }

  getTicketsHistory(response){
    for(let ticket of response.data){
      ticket.files = JSON.parse(ticket.files);
      ticket.costs = JSON.parse(ticket.costs);
    }
    this.historyTickets = response;

    this.listenTicketsHistory$.next(this.historyTickets);
  }

  changePropertyTicket(socketData){
    let userData = this.localStorageService.getLocalStorage('token');
    if(socketData){
      if(socketData.data.type){
        this.listenCommentTicket$.next(socketData);
        if(socketData.meta.sender_type==='hospital'){
          if(socketData.data.type === 'COMMENT'){
            if(this.takenTickets.data && this.takenTickets.data.length>0){
              this.takenTickets.data.forEach(ticket => {
                if(ticket.ID === socketData.data.ticket_id){
                  
                  this.dialog.getDialogById('commentBox').componentInstance.IDticket === socketData.data.ticket_id
                  this.notificationService.showNotificationComment(socketData);
                }
              });
            }
          }
        }
        
      }else{
        this.listTicketService.getListTicket(userData.token, { status: ['OPEN'] }).toPromise().then(res=>{
          let listTicket:any = res;
          if(listTicket.code === 200 && listTicket.message==='OK'){
            this.getTicketsOpen(listTicket);
          }
        });
        if(socketData.meta.sender_type==='insmart' && parseInt(socketData.meta.sender_id) === userData.data.id ){
          this.listTicketService.getListTicket(userData.token, { status:['TAKEN', 'UPDATED', 'WAITING'], insID: userData.data.id }).toPromise().then(res=>{
            let listTicket:any = res;
            if(listTicket.code === 200 && listTicket.message==='OK'){
              this.getDirectBillingTaken(listTicket);
            }
          });
        }
        if(
        (socketData.data.insmart_status === 'VERIFINED' ||
          socketData.data.insmart_status === 'DENIED' ||
          socketData.data.insmart_status === 'CONFIRM' ||
          socketData.data.insmart_status === 'REJECT' ||
          socketData.data.hospital_status === 'CONFIRM' ||
          socketData.data.hospital_status === 'REJECT') &&
          parseInt(socketData.meta.sender_id) === userData.data.id
        ){
          this.listTicketService.getListTicket(userData.token, { status:['VERIFIED', 'DENIED', 'CONFIRM', 'REJECT'], insID: userData.data.id }).toPromise().then(res=>{
            let listTicket:any = res;
            if(listTicket.code === 200 && listTicket.message==='OK'){
              this.getTicketsHistory(listTicket);
            }
          });
        }
      }
    }else{
      return 'Có gì đó bị lỗi rồi';
    }

  }

  
}
