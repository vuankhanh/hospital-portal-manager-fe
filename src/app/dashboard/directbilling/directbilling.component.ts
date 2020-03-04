import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { ConfirmActionComponent } from '../../sharing/modal/confirm-action/confirm-action.component';
import { CaseNumberComponent } from '../../sharing/modal/case-number/case-number.component';
import { CommentComponent } from '../../sharing/modal/comment/comment.component';
import { ReasonInputComponent } from '../../sharing/modal/reason-input/reason-input.component';
import { ImageShowComponent } from '../../sharing/modal/image-show/image-show.component';

import { TimelineOfRequestsService, Timer } from '../../service/timeline-of-requests.service';
import { TraTuService } from '../../service/tra-tu.service';
import { CopyService } from '../../service/copy.service';
import { ListTicketsService } from '../../service/list-tickets.service';
import { LocalStorageService } from '../../service/local-storage.service';
import { UpdateCasenumberService } from '../../service/api/put/update-casenumber.service';
import { UpdateTicketCostService } from '../../service/api/put/update-ticket-cost.service';
import { ConfirmService } from '../../service/api/put/confirm.service';
import { RejectService } from '../../service/api/put/reject.service';
import { DetailTicketService } from '../../service/api/get/detail-ticket.service';

import { map, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PushSmsService } from '../../service/api/post/push-sms.service';
@Component({
  selector: 'app-directbilling',
  templateUrl: './directbilling.component.html',
  styleUrls: ['./directbilling.component.scss']
})
export class DirectbillingComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenuTrigger,{static:false}) contextMenu: MatMenuTrigger;
  costForm: FormGroup;
  response:any ;
  countDownTimer: Timer;
  displayedColumns: string[] = ['category', 'money', 'note'];
  displayedColumnsFix: string[] = ['money', 'note'];

  contextMenuPosition = { x: '0px', y: '0px' };

  editCostTable:any = [];

  datePipe = new DatePipe('en-US');
  listenDirectBillingTakenSubscription: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private timelineOfRequestsService: TimelineOfRequestsService,
    public traTuService: TraTuService,
    private listTicketsService: ListTicketsService,
    private detailTicketService: DetailTicketService,
    public copyService: CopyService,
    private localStorageService: LocalStorageService,
    private updateCasenumberService: UpdateCasenumberService,
    private updateTicketCostService: UpdateTicketCostService,
    private confirmService: ConfirmService,
    private rejectService: RejectService,
    private pushSmsService: PushSmsService
  ) { }

  ngOnInit() {
    this.pushSmsService.pushSms().then(res=>{
      console.log(res)}
    ).catch(err=>console.error(err));
    
    let userData = this.localStorageService.getLocalStorage('token');
    this.listenDirectBillingTakenSubscription = this.listTicketsService.listenDirectBillingTaken.subscribe(resTickets=>{
      if(resTickets){
        resTickets.data = resTickets.data.filter(ticket=>ticket.insmart_user_id === userData.data.id);
        this.response = resTickets;
        console.log(this.response);
        for(let requestForRefund of this.response.data){
          requestForRefund.countDown = this.timelineOfRequestsService.calcCountdown(15, requestForRefund.created_at);
          this.detailTicketService.getDetailTicket(userData.token, requestForRefund.ID).subscribe(res=>{
            let response:any = res;
            if(response.code === 200 && response.message ==='OK'){
              response.data.comments.forEach(comment=>{
                if(comment.type === 'UPDATE_COST'){
                  
                  if(comment.hospital_user_id > 0){
                    requestForRefund.insmartCosts = JSON.parse(comment.content).costs;
                  }
                }
              })
            }
          })
        }
      }
    });
  }

  countTotal(arrayNumber:any){
    
    let total = 0;
    arrayNumber.forEach(element=>{
      total += parseInt(element.cost_amount);
    });
    return total;
  }

  onRightClick(event: MouseEvent, element: any){
    event.preventDefault();
    
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'id': element };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  setCaseNumber(element){
    this.dialog.open(CaseNumberComponent,{data: element.note}).afterClosed().subscribe(caseNumber=>{
      let userData = this.localStorageService.getLocalStorage('token');
      this.updateCasenumberService.insmartUpdateCaseNo(element.ID, caseNumber, userData.token).subscribe(res=>{
        if(res.code === 200 && res.message==='OK'){
          alert('Đã cập nhất số Case Number'); 
        }
      });
    })
  }

  showImage(imageList, index){
    let data = {
      mainImage: index,
      images: imageList
    }
    this.dialog.open(ImageShowComponent, {
      data: data
    });
  }

  addComment(ticket){
    this.dialog.open(CommentComponent,{
      data: ticket.ID
    })
  }

  costFormChange(event){
    console.log(event);
    this.costForm = <FormGroup>event;
  }

  reject(ticket){
    let userData = this.localStorageService.getLocalStorage('token');
    this.dialog.open(ReasonInputComponent).afterClosed().subscribe(reason=>{
      if(reason && reason.length >10){
        this.rejectService.insmartReject(ticket.ID, reason, userData.token).subscribe(response=>{
          if(response.code === 200 && response.message==='OK'){
            alert('Đã huỷ ticket với lý do '+reason);
          }
        })
      }
    })
  }

  startProccess(ticket){
    let userData = this.localStorageService.getLocalStorage('token');
    
    if(ticket.costs.length>0){
      console.log(ticket.accordion);
      if(ticket.accordion){
        if(this.costForm && this.costForm.valid){
          this.updateTicketCostService.insmartUpdateCosts(ticket.ID, this.parseToNumber(this.costForm.value), userData.token).subscribe(res=>{
            let response: any = res;
            console.log(response);
            
            if(response.code === 200 && response.message==='OK'){
              alert('Đã xong');
            }
          })
        }
      }
    }else{
      this.confirmService.insmartConfirm(ticket.ID, userData.token).subscribe(res=>{
        let response: any = res;
        console.log(response);
        
        if(response.code === 200 && response.message==='OK'){
          
          alert('Đã xong');
        }
      });
    }
    
  }

  parseToNumber(body: any){
    if(body){
      let arrayCosts = [];
      for(let cost of body.costs ){
        let cost_amount = cost.cost_amount.toString().replace(/,/gi, '');
        cost.cost_amount = parseInt(cost_amount);
        arrayCosts.push(cost);
      }
      let maximum_claim_value = body.opd_cost_details.maximum_claim_value.toString().replace(/,/gi, '');
      body.opd_cost_details.maximum_claim_value = parseInt(maximum_claim_value);
      body.costs = arrayCosts;
      return body;
    }
  }

  ngOnDestroy(){
    this.listenDirectBillingTakenSubscription.unsubscribe();
  }
}

export interface Response{

}
