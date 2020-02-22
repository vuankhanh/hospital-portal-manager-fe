import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { ConfirmActionComponent } from '../../../sharing/modal/confirm-action/confirm-action.component';
import { CaseNumberComponent } from '../../../sharing/modal/case-number/case-number.component';
import { CommentComponent } from '../../../sharing/modal/comment/comment.component';
import { ReasonInputComponent } from '../../../sharing/modal/reason-input/reason-input.component';

import { TimelineOfRequestsService, Timer } from '../../../service/timeline-of-requests.service';
import { TabPageService } from 'src/app/service/tab-page.service';
import { TraTuService } from '../../../service/tra-tu.service';
import { CopyService } from '../../../service/copy.service';
import { ListTicketsService } from '../../../service/list-tickets.service';
import { LocalStorageService } from '../../../service/local-storage.service';
import { UpdateCasenumberService } from '../../../service/api/put/update-casenumber.service';
import { UpdateTicketCostService } from '../../../service/api/put/update-ticket-cost.service';
import { ConfirmService } from '../../../service/api/put/confirm.service';
import { RejectService } from '../../../service/api/put/reject.service';
@Component({
  selector: 'app-proccess-the-refund-request',
  templateUrl: './proccess-the-refund-request.component.html',
  styleUrls: ['./proccess-the-refund-request.component.scss']
})
export class ProccessTheRefundRequestComponent implements OnInit {
  @ViewChild(MatMenuTrigger,{static:false}) contextMenu: MatMenuTrigger;
  costForm: FormGroup;
  requestForRefunds:any;
  countDownTimer: Timer;
  displayedColumns: string[] = ['category', 'money', 'note'];
  displayedColumnsFix: string[] = ['money', 'note'];

  contextMenuPosition = { x: '0px', y: '0px' };

  editCostTable:any = [];
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private timelineOfRequestsService: TimelineOfRequestsService,
    private tabPageService: TabPageService,
    public traTuService: TraTuService,
    private listTicketsService: ListTicketsService,
    public copyService: CopyService,
    private localStorageService: LocalStorageService,
    private updateCasenumberService: UpdateCasenumberService,
    private updateTicketCostService: UpdateTicketCostService,
    private confirmService: ConfirmService,
    private rejectService: RejectService
  ) {}

  ngOnInit() {
    this.listTicketsService.listenListTicket.subscribe(resTickets=>{
      if(resTickets){
        this.requestForRefunds = resTickets.filter(ticket=>ticket.costs.length>0 && ticket.insmart_status === 'TAKEN');
        for(let requestForRefund of this.requestForRefunds){
          requestForRefund.countDown = this.timelineOfRequestsService.calcCountdown(15, requestForRefund.created_at);
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
      let token = this.localStorageService.getLocalStorage('token');
      this.updateCasenumberService.insmartUpdateCaseNo(element.ID, caseNumber, token).subscribe(res=>{
        if(res.code === 200 && res.message==='OK'){
          this.listTicketsService.changePropertyTicket(res.data);
        }
      });
    })
  }

  addComment(ticket){
    this.dialog.open(CommentComponent,{
      data: ticket
    })
  }

  costFormChange(event){
    this.costForm = <FormGroup>event;
  }

  reject(ticket){
    let token = this.localStorageService.getLocalStorage('token');
    this.dialog.open(ReasonInputComponent).afterClosed().subscribe(reason=>{
      if(reason && reason.length >10){
        this.rejectService.insmartReject(ticket.ID, reason, token).subscribe(response=>{
          if(response.code === 200 && response.message==='OK'){
            this.listTicketsService.changePropertyTicket(response.data);
          }
        })
      }
    })
  }

  startProccess(requestForRefund){
    let token = this.localStorageService.getLocalStorage('token');
    console.log(this.costForm);
    console.log(this.costForm.valid);
    if(this.costForm && this.costForm.valid){
      this.updateTicketCostService.insmartUpdateCosts(requestForRefund.ID, this.parseToNumber(this.costForm.value), token).subscribe(res=>{
        let response: any = res;
        console.log(response);
        
        if(response.code === 200 && response.message==='OK'){
          alert('Đã xong');
        }
      })
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
}

interface Message{
  from:number;
  content:string;
  date:Date;

}
