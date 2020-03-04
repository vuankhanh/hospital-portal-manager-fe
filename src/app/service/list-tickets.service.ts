import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { CommentComponent } from '../sharing/modal/comment/comment.component';

import { LocalStorageService } from './local-storage.service';
import { PushNotificationsService} from 'ng-push';
import { ListTicketService } from './api/get/list-ticket.service';
import { MatDialog } from '@angular/material';

import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ListTicketsService {
  takenTickets:any;
  openTickets:any;

  listenCommentTicket$:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listenCommentTicket: Observable<any> = this.listenCommentTicket$.asObservable();

  //234234
  listenDirectBillingTaken$:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listenDirectBillingTaken: Observable<any> = this.listenDirectBillingTaken$.asObservable();

  listenTicketsOpen$:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listenTicketsOpen: Observable<any> = this.listenTicketsOpen$.asObservable();
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private localStorageService: LocalStorageService,
    private _pushNotifications: PushNotificationsService,
    private listTicketService: ListTicketService,
    private dialog: MatDialog
  ) {
    this._pushNotifications.requestPermission();
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

  changePropertyTicket(socketData){
    let userData = this.localStorageService.getLocalStorage('token');
    console.log(socketData);
    if(socketData){
      
      if(socketData.data.type){
        if(socketData.meta.sender_type==='hospital'){
          if(socketData.data.type === 'COMMENT'){
            if(this.takenTickets.data && this.takenTickets.data.length>0){
              this.takenTickets.data.forEach(ticket => {
                if(ticket.ID === socketData.data.ticket_id){
                  this.showNotification(socketData);
                }
              });
            }
          }
        }
      }else{
        this.listTicketService.getListTicket(userData.token, { status: 'OPEN' }).toPromise().then(res=>{
          let listTicket:any = res;
          if(listTicket.code === 200 && listTicket.message==='OK'){
            this.getTicketsOpen(listTicket);
          }
        });
        if(socketData.meta.sender_type==='insmart' && parseInt(socketData.meta.sender_id) === userData.data.id ){
          console.log(socketData.meta);
          
          this.listTicketService.getListTicket(userData.token, { status: 'TAKEN' }).toPromise().then(res=>{
            let listTicket:any = res;
            if(listTicket.code === 200 && listTicket.message==='OK'){
              this.getDirectBillingTaken(listTicket);
            }
          });
        }
      //   let checkExistTicket: boolean;
    
      //   ticket.files = JSON.parse(ticket.files);
      //   ticket.costs = JSON.parse(ticket.costs);
    
      //   for(let i=0; i<this.listTickets.length;i++){
      //     if(this.listTickets[i].ID === ticket.ID){
      //       checkExistTicket=true;
      //       this.listTickets[i] = ticket;
      //     }
      //   }
    
      //   if(!checkExistTicket){
      //     this.listTickets.push(ticket);
      //   }
      }
      // this.listTicket$.next(this.listTickets);
    }else{
      return 'Có gì đó bị lỗi rồi';
    }

  }

  showNotification(socketData){
    let types = ['TICKET', 'COMMENT', 'CHANGE_STATUS', ''];
    
    let body:string = '';
    if(socketData.data.type=== types[1]){
      let content = JSON.parse(socketData.data.content);
      body = content.message;
    }
    let options = { //set options
      body: body,
      icon: "assets/imgs/sheild.png" //adding an icon
    }
     this._pushNotifications.create(socketData.meta.sender_id+' đã trả lời ticket số '+socketData.data.ticket_id, options).subscribe( //creates a notification
      res =>{
        if(res.event.type === 'click'){
          console.log(res);
          this.ngZone.run(()=>{
            this.router.navigateByUrl('/dashboard/directbilling').then(_=>{
              window.focus();
              this.dialog.open(CommentComponent,{
                data: socketData.data.ticket_id
              })
            });
          })
          res.notification.close();
        }
      },
      err => console.log(err)
    );
  }
}
