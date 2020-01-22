import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';

import { ConfirmActionComponent } from '../../../modal/confirm-action/confirm-action.component';

import { TimelineOfRequestsService, Timer } from '../../../service/timeline-of-requests.service';
import { TabPageService } from 'src/app/service/tab-page.service';
import { TraTuService } from '../../../service/tra-tu.service';
import { FakeRequestARefundService } from '../../../service/fake-request-a-refund.service';
import { CopyService } from '../../../service/copy.service';
@Component({
  selector: 'app-proccess-the-refund-request',
  templateUrl: './proccess-the-refund-request.component.html',
  styleUrls: ['./proccess-the-refund-request.component.scss']
})
export class ProccessTheRefundRequestComponent implements OnInit {
  @ViewChild('inputCaseNumber',{static:false}) inputCaseNumber: ElementRef;
  @ViewChild(MatMenuTrigger,{static:false}) contextMenu: MatMenuTrigger;
  @ViewChild('limitTheRemainingBenefits',{static:false} ) limitTheRemainingBenefits: ElementRef
  requestForRefunds:any;
  countDownTimer: Timer;
  displayedColumns: string[] = ['category', 'money', 'note'];
  displayedColumnsFix: string[] = ['money', 'note'];

  messageConversation:string='';
  contextMenuPosition = { x: '0px', y: '0px' };

  setCaseNumberFocus: number;
  constructor(
    private dialog: MatDialog,
    private timelineOfRequestsService: TimelineOfRequestsService,
    private tabPageService: TabPageService,
    public traTuService: TraTuService,
    private fakeRequestARefundService: FakeRequestARefundService,
    public copyService: CopyService
  ) {
    this.requestForRefunds = this.fakeRequestARefundService.refundRequests;
  }

  ngOnInit() {
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
      total += parseInt(element.value);
    });
    return total;
  }

  onBlurSetCaseNo(value, id){
    console.log(event)
    this.setCaseNumberFocus = null;
  }
  // onFocusSetCaseNo(event, id){
  //   this.setCaseNumberFocus = id;
  // }

  onRightClick(event: MouseEvent, element: any){
    event.preventDefault();
    console.log(element);
    
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'id': element.id };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  setCaseNumber(id){
    console.log(id);
    this.setCaseNumberFocus = id;
    setTimeout(() => {
      this.inputCaseNumber.nativeElement.focus()
    }, 150);
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
