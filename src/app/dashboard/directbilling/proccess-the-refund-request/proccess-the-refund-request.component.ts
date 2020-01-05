import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ConfirmActionComponent } from '../../../modal/confirm-action/confirm-action.component';

import { TimelineOfRequestsService, Timer } from '../../../service/timeline-of-requests.service';
import { DirectBillingService } from 'src/app/service/direct-billing.service';
import { TabPageService } from 'src/app/service/tab-page.service';
@Component({
  selector: 'app-proccess-the-refund-request',
  templateUrl: './proccess-the-refund-request.component.html',
  styleUrls: ['./proccess-the-refund-request.component.scss']
})
export class ProccessTheRefundRequestComponent implements OnInit {
  requestForRefunds:any;
  countDownTimer: Timer;
  displayedColumns: string[] = ['category', 'money', 'note'];
  displayedColumnsFix: string[] = ['money', 'note'];

  messageConversation:string='';
  constructor(
    private dialog: MatDialog,
    private timelineOfRequestsService: TimelineOfRequestsService,
    public directBillingService : DirectBillingService,
    private tabPageService: TabPageService
  ) {
    this.timelineOfRequestsService.historyDirectBilling().subscribe(refundRequests=>{
      let anyRefundRequests:any = refundRequests;
      this.directBillingService.setProccessRequestForRefund(anyRefundRequests[anyRefundRequests.length-1]);
    });
    
    this.directBillingService.listentProccessRequestForRefund$.subscribe(res=>{
      this.requestForRefunds = res;
      console.log(this.requestForRefunds);
    });
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
