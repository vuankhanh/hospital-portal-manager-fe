import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ConfirmActionComponent } from '../../../modal/confirm-action/confirm-action.component';

import { TimelineOfRequestsService, Timer } from '../../../service/timeline-of-requests.service';
import { HospitalCheckService } from '../../../service/hospital-check.service';
import { LocalStorageService } from '../../../service/local-storage.service';
import { DirectbillingTheRequirementService } from '../../../service/directbilling-the-requirement.service';
import { TraTuService } from '../../../service/tra-tu.service';

@Component({
  selector: 'app-proccess-the-requrements',
  templateUrl: './proccess-the-requrements.component.html',
  styleUrls: ['./proccess-the-requrements.component.scss']
})
export class ProccessTheRequrementsComponent implements OnInit {
  @ViewChild('contentContainer', {static:false}) private contentContainer: ElementRef
  countDownTimer: Timer;
  processCase:any = [];
  messageConversation:string='';
  constructor(
    private timelineOfRequestsService: TimelineOfRequestsService,
    private hospitalCheckService: HospitalCheckService,
    private localStorageService: LocalStorageService,
    private directbillingTheRequirementService: DirectbillingTheRequirementService,
    public traTuService: TraTuService,
    private dialog: MatDialog
  ) {
    this.countDownTime();
  }

  ngOnInit() {
    this.directbillingTheRequirementService.listenDbTheRequestments.subscribe(res=>{
      console.log(res);
      
      this.processCase = res;
    })
  }

  countDownTime(){
    this.timelineOfRequestsService.listenCountdown$.subscribe(timer=>{
      this.countDownTimer = timer;
    });
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
          try {
            this.contentContainer.nativeElement.scrollTop = this.contentContainer.nativeElement.scrollHeight;
          } catch (error) {
            console.log(error);
          }
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
    
    for(let requestForRefund of this.processCase){
      if(requestForRefund.id === id){
        requestForRefund.conversation.push(message);
      }
    }
  }

  confirm(element){
    console.log(element.id);
    let token = this.localStorageService.getLocal('token');
    this.hospitalCheckService.getHospitalConfirm(element.id, token).subscribe(response=>{
      console.log(response);
      this.directbillingTheRequirementService.removeTheRequestments(element);
    });
  }

  reject(element){
    console.log(element.id);
    let token = this.localStorageService.getLocal('token');
    this.hospitalCheckService.getHospitalReject(element.id, token).subscribe(response=>{
      console.log(response);
      this.directbillingTheRequirementService.removeTheRequestments(element);
    });
  }
  
}

interface Message{
  from:number;
  content:string;
  date:Date;
}