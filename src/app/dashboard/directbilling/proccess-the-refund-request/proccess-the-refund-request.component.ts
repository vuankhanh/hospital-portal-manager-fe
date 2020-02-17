import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';

import { ConfirmActionComponent } from '../../../sharing/modal/confirm-action/confirm-action.component';
import { CaseNumberComponent } from '../../../sharing/modal/case-number/case-number.component';

import { TimelineOfRequestsService, Timer } from '../../../service/timeline-of-requests.service';
import { TabPageService } from 'src/app/service/tab-page.service';
import { TraTuService } from '../../../service/tra-tu.service';
import { CopyService } from '../../../service/copy.service';
import { ListTicketsService } from '../../../service/list-tickets.service';
import { LocalStorageService } from '../../../service/local-storage.service';
import { UpdateCasenumberService } from '../../../service/api/put/update-casenumber.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
@Component({
  selector: 'app-proccess-the-refund-request',
  templateUrl: './proccess-the-refund-request.component.html',
  styleUrls: ['./proccess-the-refund-request.component.scss']
})
export class ProccessTheRefundRequestComponent implements OnInit {
  @ViewChild(MatMenuTrigger,{static:false}) contextMenu: MatMenuTrigger;
  @ViewChild('limitTheRemainingBenefits',{static:false} ) limitTheRemainingBenefits: ElementRef
  requestForRefunds:any;
  countDownTimer: Timer;
  displayedColumns: string[] = ['category', 'money', 'note'];
  displayedColumnsFix: string[] = ['money', 'note'];

  messageConversation:string='';
  contextMenuPosition = { x: '0px', y: '0px' };

  editCostTable: any;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private timelineOfRequestsService: TimelineOfRequestsService,
    private tabPageService: TabPageService,
    public traTuService: TraTuService,
    private listTicketsService: ListTicketsService,
    public copyService: CopyService,
    private localStorageService: LocalStorageService,
    private updateCasenumberService: UpdateCasenumberService
  ) {}

  ngOnInit() {
    this.listTicketsService.listenListTicket.subscribe(resTickets=>{
      if(resTickets){
        // console.log(resTickets);
        this.requestForRefunds = resTickets.filter(ticket=>ticket.costs.length>0 && ticket.insmart_status === 'TAKEN');
        console.log(this.requestForRefunds);
      }
    });
    this.countDownTime();
  }

  countDownTime(){
    this.timelineOfRequestsService.listenCountdown$.subscribe(timer=>{
      this.countDownTimer = timer;
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

  changeCheckBox(event, index){
    this.requestForRefunds[0].benefitLimitExceeded = event.checked;
    if(this.requestForRefunds[0].benefitLimitExceeded){
      setTimeout(() => {
        this.limitTheRemainingBenefits.nativeElement.focus();
      }, 150);
    }
  }

  sendMessage(event, id){
    if(this.messageConversation){
      this.dialog.open(ConfirmActionComponent, {
        width: '500px',
        data: {
          title: 'Xác nhận',
          question: 'Bạn chắc chắn sẽ gửi Yêu Cầu Bổ Sung Thông Tin chứ ?',
          btnReject: 'Huỷ',
          btnConfirm: 'Chắc chắn!'
        }
      }).afterClosed().subscribe(result=>{
        if(result){
          this.addMessage(id, this.messageConversation);
          this.messageConversation='';
        }else{
          console.log('Huỷ Modal');
          
        }
      })
    }
  }

  addMessage(id, messageConversation){
    let message: Message;
    message = {
      from:1,
      content:messageConversation,
      date: new Date()
    };
    
    for(let requestForRefund of this.requestForRefunds){
      if(requestForRefund.id === id){
        requestForRefund.conversation.push(message);
      }
    }
  }

  

  startProccess(requestForRefund){
    console.log(requestForRefund);
  }
}

interface Message{
  from:number;
  content:string;
  date:Date;

}
