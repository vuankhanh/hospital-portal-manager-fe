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

import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { PushSmsService } from '../../service/api/post/push-sms.service';
import { ListTicketService } from '../../service/api/get/list-ticket.service';
import { ToastService } from '../../service/toast.service';
@Component({
  selector: 'app-directbilling',
  templateUrl: './directbilling.component.html',
  styleUrls: ['./directbilling.component.scss']
})
export class DirectbillingComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenuTrigger,{static:false}) matMenuUpdateCaseNo: MatMenuTrigger;
  @ViewChild(MatMenuTrigger,{static:false}) matMenuUpdateInsurerId: MatMenuTrigger;
  costForm: FormGroup;
  response:any ;
  countDownTimer: Timer;

  costForms:Array<FormGroup> = [];

  displayedColumns: string[] = ['category', 'money', 'note'];
  displayedColumnsFix: string[] = ['money', 'note'];

  length = 0;
  pageSize = 0;
  pageSizeOptions: number[] = [5, 10, 15, 20];

  contextMenuPosition = { x: '0px', y: '0px' };
  typeContextMenu: string;

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
    private spinner: NgxSpinnerService,
    private pushSmsService: PushSmsService,
    private listTicketService: ListTicketService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.spinner.show('originSpinner', {
      fullScreen: false
    });
    
    this.listenDirectBillingTakenSubscription = this.listTicketsService.listenDirectBillingTaken.subscribe(resTickets=>{
      this.setList(resTickets);
    });
  }

  setList(resTickets){
    let userData = this.localStorageService.getLocalStorage('token');
    if(resTickets){
      resTickets.data = resTickets.data;
      this.response = resTickets;
      this.length = this.response.total;
      this.pageSize = this.response.page_size;

      for(let requestForRefund of this.response.data){
        requestForRefund.countDown = this.timelineOfRequestsService.calcCountdown(15, requestForRefund.created_at);
        this.detailTicketService.getDetailTicket(userData.token, requestForRefund.ID).subscribe(res=>{
          let response:any = res;
          if(response.code === 200 && response.message ==='OK'){
            response.data.comments.forEach(comment=>{
              if(comment.type === 'UPDATE_COST'){
                if(comment.hospital_user_id > 0){
                  requestForRefund.insmartCosts = JSON.parse(comment.content).costs;
                  requestForRefund.diag_note = JSON.parse(comment.content).cost_details.diag_note;
                  requestForRefund.maximum_claim_value = JSON.parse(comment.content).cost_details.maximum_claim_value;
                  requestForRefund.social_insurance_id = JSON.parse(comment.content).cost_details.social_insurance_id;
                  requestForRefund.is_apply_social_insurance = JSON.parse(comment.content).cost_details.is_apply_social_insurance;
                }
              }
            })
          }
        })
      }
    }
  }

  countTotal(arrayNumber:any){
    
    let total = 0;
    arrayNumber.forEach(element=>{
      total += parseInt(element.cost_amount);
    });
    return total;
  }

  onRightClick(event: MouseEvent, element: any, type: string){
    event.preventDefault();

    console.log(type);

    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.typeContextMenu = type;
    if(this.typeContextMenu === 'caseNo'){
      this.matMenuUpdateCaseNo.menuData = { 'id': element };
      // this.matMenuUpdateCaseNo.menu.focusFirstItem('mouse');
      this.matMenuUpdateCaseNo.openMenu();
    }else if(this.typeContextMenu === 'insurerId'){
      this.matMenuUpdateInsurerId.menuData = { 'id': element };
      // this.matMenuUpdateInsurerId.menu.focusFirstItem('mouse');
      this.matMenuUpdateInsurerId.openMenu();
    }
    
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

  showAccordion(i: number){
    this.response.data.forEach((value, index)=>{
      if(i === index){
        value.accordion = !value.accordion;
      }else{
        value.accordion = false;
      }
    });
  }

  addComment(ticket){
    this.dialog.open(CommentComponent,{
      data: ticket.ID,
      id: 'commentBox'
    }).afterClosed().toPromise().then(_=>{console.log('Closed')});

    setTimeout(() => {
      console.log(this.dialog.openDialogs);
    }, 500);
  }

  costFormChange(event){
    console.log(event);
    this.costForm = <FormGroup>event;
  }

  pageChangeEvent(event){
    let userData = this.localStorageService.getLocalStorage('token');
    this.listTicketService.getListTicket(userData.token, { status:['TAKEN', 'WAITING', 'REPLIED'], insID: userData.data.id, page: event.pageIndex+1, pageSize: event.pageSize }).toPromise().then(res=>{
      let response: any = res;
      if(response.code === 200 && response.message === 'OK'){
        for(let ticket of response.data){
          ticket.files = JSON.parse(ticket.files);
          ticket.costs = JSON.parse(ticket.costs);
        }
        this.setList(response);
      }
    });
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
    console.log(ticket);
    
    if(ticket.costs.length>0){
      if(ticket.accordion){
        if(this.costForm && this.costForm.valid){
          let costsWillUpdate = this.parseToNumber(this.costForm.value);
          ticket.insmartCosts = costsWillUpdate.costs;
          ticket.maximum_claim_value = costsWillUpdate.opd_cost_details.maximum_claim_value;
          this.dialog.open(ConfirmActionComponent,{
            data:  ticket,
            maxWidth: 'unset'
          }).afterClosed().subscribe(res=>{
            if(res){
              this.updateTicketCostService.insmartUpdateCosts(ticket.ID, costsWillUpdate, userData.token).subscribe(res=>{
                let response: any = res;
                console.log(response);
                
                if(response.code === 200 && response.message==='OK'){
                  alert('Đã xong');
                  this.detailTicketService.getDetailTicket(userData.token, response.data.ID).subscribe(result=>{
                    let results:any = result;
                    if(results.code === 200 && results.message ==='OK' ){
                      results.data.comments.forEach(comment=>{
                        if(comment.type === 'UPDATE_COST'){
                          if(comment.insmart_user_id > 0){
                            comment.content = JSON.parse(comment.content);
                            let fee;
                            if(comment.content.cost_details.maximum_claim_value > 0){
                              fee = comment.content.cost_details.maximum_claim_value;
                            }else{
                              fee = this.countTotal(comment.content.costs);
                            }
    
                            if(response.data.isurance_id < 4){
                              // Phone Number response.patient_phone_numb
                              this.pushSmsService.lifeOpdSms(response.data.isurance_id, fee, response.data.patient_phone_numb).then(resultPushSms=>{
                                console.log(resultPushSms);
                                this.toastService.showShortToast('Đã gửi lời chúc đến KH có sđt '+resultPushSms.Phone, 'Đã gửi SMS thành công');
                              }).catch(err=>{
                                console.log(err);
                                alert('Đã có lỗi xảy ra khi gửi SMS');
                              });
                            }else{
                              this.pushSmsService.noneLifeSms(fee, response.data.patient_phone_numb).then(resultPushSms=>{
                                console.log(resultPushSms);
                                this.toastService.showShortToast('Đã gửi lời chúc đến KH có sđt '+resultPushSms.Phone, 'Đã gửi SMS thành công');
                              }).catch(err=>{
                                console.log(err);
                                alert('Đã có lỗi xảy ra khi gửi SMS');
                              });
                            }
                          }
                        }
                      });
                    }
                  })
                }
              })
            }
          })
        }
      }else{
        alert('Bạn chưa xem Bảng Chi Phí của Ticket số '+ticket.ID);
      }
    }else{
      this.dialog.open(ConfirmActionComponent,{
        data: ticket
      }).afterClosed().subscribe(res=>{
        console.log(res);
        if(res){
          this.confirmService.insmartConfirm(ticket.ID, userData.token).subscribe(res=>{
            let response: any = res;
            console.log(response);
            if(response.code === 200 && response.message==='OK'){
              alert('Đã xong');
            }
          });
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
