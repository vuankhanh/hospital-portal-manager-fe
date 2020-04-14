import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog, MatMenuTrigger } from '@angular/material';

import { ImageShowComponent } from '../../sharing/modal/image-show/image-show.component';
import { CaseNumberComponent } from '../../sharing/modal/case-number/case-number.component';
import { UpdateInsurerIdComponent } from '../../sharing/modal/update-insurer-id/update-insurer-id.component';

import { LocalStorageService } from '../../service/local-storage.service';
import { ValidationFilesUploadService } from '../../service/validation-files-upload.service';
import { DetailTicketService } from '../../service/api/get/detail-ticket.service';
import { ListTicketsService } from '../../service/list-tickets.service';
import { TraTuService } from '../../service/tra-tu.service';
import { CopyService } from '../../service/copy.service';
import { ListTicketService } from '../../service/api/get/list-ticket.service';
import { UpdateInsurerService } from '../../service/api/put/update-insurer.service';

import { Subscription } from 'rxjs';
import { UpdateCasenumberService } from '../../service/api/put/update-casenumber.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenuTrigger,{static:false}) matMenuUpdateCaseNo: MatMenuTrigger;
  history: any;

  length = 0;
  pageSize = 0;
  pageSizeOptions: number[] = [5, 10, 15, 20];

  contextMenuPosition = { x: '0px', y: '0px' };

  displayedColumns: string[] = ['category', 'money', 'note'];

  datePipe = new DatePipe('en-US');
  listenHistoryTicketSubscription: Subscription;
  constructor(
    public traTuService: TraTuService,
    public copyService: CopyService,
    private localStorageService: LocalStorageService,
    private validationFilesUploadService: ValidationFilesUploadService,
    private detailTicketService: DetailTicketService,
    private listTicketsService: ListTicketsService,
    private dialog: MatDialog,
    private listTicketService: ListTicketService,
    private updateInsurerService: UpdateInsurerService,
    private updateCasenumberService: UpdateCasenumberService
  ) { }

  ngOnInit() {
    this.listenHistoryTicketSubscription = this.listTicketsService.listenTicketsHistory.subscribe(resTickets=>{
      this.setList(resTickets);
    });
  }

  setList(resTickets){
    let userData = this.localStorageService.getLocalStorage('token');
    if(resTickets){
      resTickets.data = resTickets.data;
      this.history = resTickets;
      this.length = this.history.total;
      this.pageSize = this.history.page_size;

      for(let history of this.history.data){
        history.files = history.files.map(url=>{
          return this.validationFilesUploadService.pipeImageUrl(url);
        })
        this.detailTicketService.getDetailTicket(userData.token, history.ID).subscribe(res=>{
          let response:any = res;
          if(response.code === 200 && response.message ==='OK'){
            let countHospitalUpdate:number = 0;
            response.data.comments.forEach(comment=>{
              let reason = JSON.parse(comment.content);
              if(comment.type === 'REQUEST_COST'){

                if(comment.hospital_user_id > 0){
                  history.hospitalCosts = JSON.parse(comment.content).costs;
                  countHospitalUpdate++;
                }

                if(history.diag_note === ''){
                  history.diag_note = JSON.parse(comment.content).cost_details.diag_note;
                  history.social_insurance_id = JSON.parse(comment.content).cost_details.social_insurance_id;
                  history.is_apply_social_insurance = JSON.parse(comment.content).cost_details.is_apply_social_insurance;
                }
              }else if(comment.type === 'INSMART_UPDATE_COST'){
                if(comment.insmart_user_id > 0){
                  history.insmartCosts = JSON.parse(comment.content).costs;
                  history.maximum_claim_value = JSON.parse(comment.content).cost_details.maximum_claim_value;
                }
              }
              if(comment.type === 'CHANGE_STATUS' && (reason.new_status === 'DENIED' || reason.new_status === 'REJECT')){
                history.reason = reason;
              }
            })
          }
          
        })
      }

      this.history.data = this.history.data.sort((a, b)=>b.updated_at - a.updated_at);
    }
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

  countTotal(arrayNumber:any){
    let total = 0;
    arrayNumber.forEach(element=>{
      total += parseInt(element.cost_amount);
    });
    return total;
  }

  showAccordion(i: number){
    this.history.data.forEach((value, index)=>{
      if(i === index){
        value.accordion = !value.accordion;
      }else{
        value.accordion = false;
      }
    });
  }

  pageChangeEvent(event){
    let userData = this.localStorageService.getLocalStorage('token');
    this.listTicketService.getListTicket(userData.token, { status:['VERIFIED', 'DENIED', 'CONFIRM', 'REJECT'], insID: userData.data.id, page: event.pageIndex+1, pageSize: event.pageSize }).toPromise().then(res=>{
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

  ngOnDestroy(){
    this.listenHistoryTicketSubscription.unsubscribe();
  }

}
