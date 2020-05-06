import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

import { ImageShowComponent } from '../image-show/image-show.component';

import { ListTicketService } from '../../../service/api/get/list-ticket.service';
import { LocalStorageService } from '../../../service/local-storage.service';
import { ValidationFilesUploadService } from '../../../service/validation-files-upload.service';
import { DetailTicketService } from '../../../service/api/get/detail-ticket.service';
import { DateFormatService } from '../../../service/date-format.service';
import { TraTuService } from '../../../service/tra-tu.service';
import { CopyService } from '../../../service/copy.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.scss']
})
export class SearchingComponent implements OnInit {
  searching: any;
  searchingForm: FormGroup;
  showAlertMustInput: boolean = false;

  length = 0;
  pageSize = 0;
  pageSizeOptions: number[] = [5, 10, 15, 20];

  displayedColumns: string[] = ['category', 'money', 'note'];

  datePipe = new DatePipe('en-US');
  constructor(
    public dialogRef: MatDialogRef<SearchingComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private listTicketService: ListTicketService,
    private localStorageService: LocalStorageService,
    private validationFilesUploadService: ValidationFilesUploadService,
    private detailTicketService: DetailTicketService,
    private dateFormatService: DateFormatService,
    public traTuService: TraTuService,
    public copyService: CopyService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.searchingForm = this.formBuilder.group({
      caseNumb: [''],
      fullname: ['']
    })
  }

  search(){
    if(this.searchingForm.value.caseNumb || this.searchingForm.value.fullname){
      this.showAlertMustInput = false;
      let userData = this.localStorageService.getLocalStorage('token');
      let parameterDefault = { status: this.params.status, from: this.dateFormatService.last90Day(), insID: userData.data.id };
      let params = { ...parameterDefault, ...this.searchingForm.value };
      this.listTicketService.getListTicket(userData.token, params).toPromise().then(res=>{
        this.setList(res);
      });
    }else{
      this.showAlertMustInput = true;
    }
  }

  setList(resTickets){
    let userData = this.localStorageService.getLocalStorage('token');
    if(resTickets){
      resTickets.data = resTickets.data;
      this.searching = resTickets;
      this.length = this.searching.total;
      this.pageSize = this.searching.page_size;

      for(let searching of this.searching.data){
        searching.files = JSON.parse(searching.files);
        searching.costs = JSON.parse(searching.costs);
        if(searching.files.length>0 && (typeof searching.files[0]) === 'string'){
          searching.files = searching.files.map(url=>{
            return this.validationFilesUploadService.pipeImageUrl(url);
          })
        }
        this.detailTicketService.getDetailTicket(userData.token, searching.ID).subscribe(res=>{
          let response:any = res;
          if(response.code === 200 && response.message ==='OK'){
            response.data.comments.forEach(comment=>{
              let reason = JSON.parse(comment.content);
              if(comment.type === 'REQUEST_COST'){

                if(comment.hospital_user_id > 0){
                  searching.hospitalCosts = JSON.parse(comment.content);
                }
              }else if(comment.type === 'INSMART_UPDATE_COST'){
                if(comment.insmart_user_id > 0){
                  searching.insmartCosts = JSON.parse(comment.content);
                  searching.maximum_claim_value = JSON.parse(comment.content).cost_details.maximum_claim_value;
                }
              }
              if(comment.type === 'CHANGE_STATUS' && (reason.new_status === 'DENIED' || reason.new_status === 'REJECT')){
                searching.reason = reason;
              }
            })
          }
          
        })
      }
    }
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
    this.searching.data.forEach((value, index)=>{
      if(i === index){
        value.accordion = !value.accordion;
      }else{
        value.accordion = false;
      }
    });
  }

  pageChangeEvent(event){
    let userData = this.localStorageService.getLocalStorage('token');
    this.listTicketService.getListTicket(userData.token, { status: this.params, from: this.dateFormatService.last90Day(), insID: userData.data.id, page: event.pageIndex+1, pageSize: event.pageSize }).toPromise().then(res=>{
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
}
