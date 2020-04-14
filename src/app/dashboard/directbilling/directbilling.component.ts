import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { ConfirmActionComponent } from '../../sharing/modal/confirm-action/confirm-action.component';
import { CaseNumberComponent } from '../../sharing/modal/case-number/case-number.component';
import { UpdateInsurerIdComponent } from '../../sharing/modal/update-insurer-id/update-insurer-id.component';
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
import { InsmartVerifyService } from '../../service/api/put/insmart-verify.service';
import { InsmartDenyService } from '../../service/api/put/insmart-deny.service';
import { RejectService } from '../../service/api/put/reject.service';
import { DetailTicketService } from '../../service/api/get/detail-ticket.service';

import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { PushSmsService } from '../../service/api/post/push-sms.service';
import { ListTicketService } from '../../service/api/get/list-ticket.service';
import { ToastService } from '../../service/toast.service';
import { ConfirmService } from '../../service/api/put/confirm.service';
import { tick } from '@angular/core/testing';
import { ValidationFilesUploadService } from '../../service/validation-files-upload.service';
import { UpdateInsurerService } from '../../service/api/put/update-insurer.service';

@Component({
  selector: 'app-directbilling',
  templateUrl: './directbilling.component.html',
  styleUrls: ['./directbilling.component.scss']
})
export class DirectbillingComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenuTrigger,{static:false}) matMenuUpdateCaseNo: MatMenuTrigger;
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
    private updateInsurerService: UpdateInsurerService,
    private updateTicketCostService: UpdateTicketCostService,
    private insmartVerifyService: InsmartVerifyService,
    private insmartDenyService: InsmartDenyService,
    private confirmService: ConfirmService,
    private rejectService: RejectService,
    private spinner: NgxSpinnerService,
    private pushSmsService: PushSmsService,
    private listTicketService: ListTicketService,
    private toastService: ToastService,
    private validationFilesUploadService: ValidationFilesUploadService
  ) { }

  ngOnInit() {
    this.spinner.show('originSpinner', {
      fullScreen: false
    });
    
    this.listenDirectBillingTakenSubscription = this.listTicketsService.listenDirectBillingTaken.subscribe(resTickets=>{
      this.setList(resTickets);
    });

    this.setTicket();
  }

  setList(resTickets){
    let userData = this.localStorageService.getLocalStorage('token');
    if(resTickets){
      resTickets.data = resTickets.data;
      this.response = resTickets;
      this.length = this.response.total;
      this.pageSize = this.response.page_size;

      for(let requestForRefund of this.response.data){
        requestForRefund.countDown = this.timelineOfRequestsService.calcCountdown(15, requestForRefund.hospital_updated_at);
        requestForRefund.files = requestForRefund.files.map(url=>{
          return this.validationFilesUploadService.pipeImageUrl(url);
        })
        this.detailTicketService.getDetailTicket(userData.token, requestForRefund.ID).subscribe(res=>{
          let response:any = res;
          if(response.code === 200 && response.message ==='OK'){
            response.data.comments.forEach(comment=>{
              if(comment.type === 'REQUEST_COST'){
                
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

  setTicket(){

    this.listTicketsService.listenCommentTicket.subscribe(socketData=>{
      if(socketData && socketData.data && socketData.data.ticket_id){
        if(this.response && this.response.data.length>0){
          this.response.data.forEach(ticket=>{
            if(ticket.ID === socketData.data.ticket_id){
              if(socketData.meta.sender_type === 'hospital'){
                ticket.insmart_status = 'WAITING';
                ticket.hospital_status = 'UPDATED';
    
                let now = new Date();
                ticket.countDown = this.timelineOfRequestsService.calcCountdown(15, now.toISOString());
              }else if(socketData.meta.sender_type === 'insmart'){
                ticket.insmart_status = 'UPDATED';
                ticket.hospital_status = 'WAITING';
              }
            }
          })
        }
      }
    })
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
    this.matMenuUpdateCaseNo.menuData = { 'id': element };
    this.matMenuUpdateCaseNo.openMenu();
  }

  setCaseNumber(element){
    this.dialog.open(CaseNumberComponent,{data: element.note}).afterClosed().subscribe(caseNumber=>{
      if(caseNumber){
        let userData = this.localStorageService.getLocalStorage('token');
        this.updateCasenumberService.insmartUpdateCaseNo(element.ID, caseNumber, userData.token).subscribe(res=>{
          if(res.code === 200 && res.message==='OK'){
            alert('Đã cập nhất số Case Number'); 
          }
        });
      }
    })
  }

  setInsurerId(element){
    this.dialog.open(UpdateInsurerIdComponent, { data: element.isurance_id, panelClass: 'modal-select-insurer-id' }).afterClosed().subscribe(idInsurance=>{
      if(idInsurance){
        let userData = this.localStorageService.getLocalStorage('token');
        this.updateInsurerService.updateInsurerId(element.ID ,idInsurance, userData.token).subscribe(res=>{
          if(res.code === 200 && res.message==='OK'){
            alert('Đã cập nhật Nhà Bảo Hiểm'); 
          }
        });
      }
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
  }

  costFormChange(event){
    this.costForm = <FormGroup>event;
  }

  pageChangeEvent(event){
    let userData = this.localStorageService.getLocalStorage('token');
    this.listTicketService.getListTicket(userData.token, { status:['TAKEN', 'WAITING', 'UPDATED'], insID: userData.data.id, page: event.pageIndex+1, pageSize: event.pageSize }).toPromise().then(res=>{
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
        if(ticket.costs.length>0){
          this.rejectService.insmartReject(ticket.ID, reason, userData.token).subscribe(response=>{
            if(response.code === 200 && response.message==='OK'){
              alert('Đã huỷ ticket với lý do '+reason);
            }
          })
        }else{
          this.insmartDenyService.insmartDeny(ticket.ID, reason, userData.token).subscribe(response=>{
            if(response.code === 200 && response.message==='OK'){
              alert('Đã huỷ ticket với lý do '+reason);
            }
          })
        }
      }
    })
  }

  startProccess(ticket){
    let userData = this.localStorageService.getLocalStorage('token');
    
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
                if(response.code === 200 && response.message==='OK'){
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
                                  this.toastService.showShortToast('Đã gửi lời chúc đến KH có sđt '+resultPushSms.Phone, 'Đã gửi SMS thành công');
                                }).catch(err=>{
                                  alert('Đã có lỗi xảy ra khi gửi SMS');
                                });
                              }else{
                                this.pushSmsService.noneLifeSms(fee, response.data.patient_phone_numb).then(resultPushSms=>{
                                  this.toastService.showShortToast('Đã gửi lời chúc đến KH có sđt '+resultPushSms.Phone, 'Đã gửi SMS thành công');
                                }).catch(err=>{
                                  alert('Đã có lỗi xảy ra khi gửi SMS');
                                });
                              }
                            }
                          }
                        });
                      }
                    })
                  }
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
        if(res){
          this.insmartVerifyService.insmartVerify(ticket.ID, userData.token).subscribe(res=>{
            let response: any = res;
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
