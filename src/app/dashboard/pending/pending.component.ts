import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material';

import { ListTicketsService } from '../../service/list-tickets.service';
import { TraTuService } from '../../service/tra-tu.service';
import { LocalStorageService } from '../../service/local-storage.service';
import { TakeService } from '../../service/api/put/take.service';
import { TimelineOfRequestsService } from '../../service/timeline-of-requests.service';

import { Observable, Subscription } from 'rxjs';
import { ListTicketService } from '../../service/api/get/list-ticket.service';
@Component({
  selector: 'app-peding',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  response: any;
  numbersOfPages: Array<number> = [];

  displayedColumns: string[] = ['countdown', 'id', 'ill_cause', 'fullname', 'dob', 'type', 'action'];

  length = 0;
  pageSize = 0;
  pageSizeOptions: number[] = [5, 10, 15, 20];
  // MatPaginator Output
  pageEvent: PageEvent;
  listenTicketsOpenSubscription: Subscription;
  constructor(
    private router: Router,
    private listTicketsService: ListTicketsService,
    public traTuService: TraTuService,
    private localStorageService: LocalStorageService,
    private takeService: TakeService,
    private timelineOfRequestsService: TimelineOfRequestsService,
    private listTicketService: ListTicketService
  ) { }

  ngOnInit() {
    this.listenTicketsOpenSubscription = this.listTicketsService.listenTicketsOpen.subscribe(res=>{
      this.setList(res);
    });
  }

  setList(reponse){
    if(reponse){
      this.response = reponse;
      for(let directBilling of this.response.data){
        directBilling.countDown = this.timelineOfRequestsService.calcCountdown(15, directBilling.hospital_updated_at);
      }

      this.length = this.response.total;
      this.pageSize = this.response.page_size;

      let numbersOfPage:number = Math.floor(this.response.total/this.response.page_size);
      for(let i:number = 0; i<= numbersOfPage;i++){
        this.numbersOfPages.push(i+1);
      }
    }
  }

  startProccess(element){
    //get index of element is selected in array
    let userData = this.localStorageService.getLocalStorage('token');
    this.takeService.insmartTake(element.ID, userData.token).subscribe(res=>{
      if(res.code === 200){
        this.router.navigate(['/dashboard/directbilling']);
      }
    },err=>{
        if(err.error.code === 421){
          if(err.error.message === 'Ticket already taken or cannot be take'){
            alert('Ticket này đang có người xử lý hoặc bạn không thể chọn.');
            element.disabledTaken = true;
          }
        }
    });
  }

  pageChangeEvent(event){
    let userData = this.localStorageService.getLocalStorage('token');
    this.listTicketService.getListTicket(userData.token, { status: 'OPEN', page: event.pageIndex+1, pageSize: event.pageSize }).toPromise().then(res=>{
      let response: any = res;
      if(response.code === 200 && response.message === 'OK'){
        for(let ticket of response.data){
          ticket.files = JSON.parse(ticket.files);
          ticket.costs = JSON.parse(ticket.costs);
        }
        this.setList(response);
      }
    })
    console.log(event);
  }

  ngOnDestroy(){
    this.listenTicketsOpenSubscription.unsubscribe();
  }
}
