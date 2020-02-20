import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';

import { ConfirmActionComponent } from '../../../sharing/modal/confirm-action/confirm-action.component';
import { CaseNumberComponent } from '../../../sharing/modal/case-number/case-number.component';
import { CommentComponent } from '../../../sharing/modal/comment/comment.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { TimelineOfRequestsService, Timer } from '../../../service/timeline-of-requests.service';
import { TabPageService } from 'src/app/service/tab-page.service';
import { TraTuService } from '../../../service/tra-tu.service';
import { CopyService } from '../../../service/copy.service';
import { ListTicketsService } from '../../../service/list-tickets.service';
import { LocalStorageService } from '../../../service/local-storage.service';
import { UpdateCasenumberService } from '../../../service/api/put/update-casenumber.service';
import { UpdateTicketCostService } from '../../../service/api/put/update-ticket-cost.service';
import { ConfirmService } from '../../../service/api/put/confirm.service';
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
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.listTicketsService.listenListTicket.subscribe(resTickets=>{
      if(resTickets){
        this.requestForRefunds = resTickets.filter(ticket=>ticket.costs.length>0 && ticket.insmart_status === 'TAKEN');
        for(let requestForRefund of this.requestForRefunds){
          requestForRefund.countDown = this.timelineOfRequestsService.calcCountdown(15, requestForRefund.created_at);
        }
        console.log(this.requestForRefunds);
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
    console.log(element);
    
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
    }).afterOpen().subscribe(status=>{
      console.log(status);
    })
  }

  editTableCostDetail(ticket){
    console.log(ticket);
    this.editCostTable = ticket.costs;
  }

  costFormChange(event){
    console.log('Change');
    
    this.costForm = <FormGroup>event;
  }

  reject(ticket){

  }

  startProccess(requestForRefund){
    console.log(this.costForm.valid);
    console.log(this.costForm.value);
    // let token = this.localStorageService.getLocalStorage('token');
    // if(this.costForm && this.costForm.valid){
    //   this.updateTicketCostService.insmartUpdateCosts(requestForRefund.ID, this.costForm.value, token).subscribe(res=>{
    //     let response: any = res;
    //     console.log(response);
        
    //     if(response.code === 200 && response.message==='OK'){
    //       alert('Đã xong');
    //     }
    //   })
    // }else{
    //   this.confirmService.insmartConfirm(requestForRefund, token).subscribe(res=>{
    //     let response: any = res;
    //     console.log(response);
        
    //     if(response.code === 200 && response.message==='OK'){
    //       alert('Đã Đồng Ý xong');
    //     }
    //   })
    // }
    
  }
}

interface Message{
  from:number;
  content:string;
  date:Date;

}
