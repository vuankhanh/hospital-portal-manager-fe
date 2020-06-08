import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NextDayPipe } from '../../pipes/next-day.pipe';
import { FormGroup, FormBuilder } from '@angular/forms';

import { LocalStorageService } from '../../service/local-storage.service';
import { ListTicketService } from '../../service/api/get/list-ticket.service';
import { DateFormatService } from '../../service/date-format.service';
import { DetailTicketService } from '../../service/api/get/detail-ticket.service';
import { TraTuService } from '../../service/tra-tu.service';
import { ExportDataService } from '../../service/export-data.service';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent implements OnInit {
  filterForm: FormGroup;

  insurers: any;

  displayedColumns: string[] = 
  [
    'fullname',
    'dob',
    'cmnd',
    'policy_no',
    'isurance_id',
    'ID',
    'created_at',
    'finished_at',
    'hospitalCosts',
    'insmartCosts',
    'type',
    'diag_note',
    'note',
    'hospital_name',
    'last_time',
    'updated_at',
    'insmart_status',
    'reasons',
    'insmart_user'
  ];

  numberOfRecords: number[] = [
    100,500,1000,2000,5000,10000
  ]

  defaultToday: number = Date.now();

  constructor(
    private datePipe: DatePipe,
    private nextDay: NextDayPipe,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private listTicketService: ListTicketService,
    private dateFormatService: DateFormatService,
    private detailTicketService: DetailTicketService,
    private traTuService: TraTuService,
    private exportDataService: ExportDataService
  ) {
    this.traTuService.listenInsurer.subscribe(result=>{
      this.insurers=result;
    })
  }

  ngOnInit() {
    this.initForm();
  }

  async setList(response){
    let userData = this.localStorageService.getLocalStorage('token');
    if(response){

      for(let history of response.data){
        await this.detailTicketService.getDetailTicket(userData.token, history.ID).toPromise().then(res=>{
          let response:any = res;
          if(response.code === 200 && response.message ==='OK'){
            response.data.comments.forEach(comment=>{
              let reason = JSON.parse(comment.content);
              if(comment.type === 'REQUEST_COST'){

                if(comment.hospital_user_id > 0){
                  history.hospitalCosts = JSON.parse(comment.content);
                }
              }else if(comment.type === 'INSMART_UPDATE_COST'){
                if(comment.insmart_user_id > 0){
                  history.insmartCosts = JSON.parse(comment.content);
                  history.maximum_claim_value = JSON.parse(comment.content).cost_details.maximum_claim_value;
                }
              }
              if(comment.type === 'CHANGE_STATUS' && (reason.new_status === 'DENIED' || reason.new_status === 'REJECT')){
                history.reason = reason;
              }
            })
          }
        })
      };
      this.exportData(response);
    }
  }

  initForm(){
    this.filterForm = this.formBuilder.group({
      dateFrom: this.dateFormatService.formatDate(this.defaultToday),
      dateTo: this.dateFormatService.formatDate(this.defaultToday),
      numberOfRecord: this.numberOfRecords[4]
    })
  }

  filterData(){
    if(this.filterForm.valid){
      let dateFrom = this.dateFormatService.formatDate(new Date(this.filterForm.value.dateFrom));
      let dateTo = this.dateFormatService.formatDate(new Date(this.filterForm.value.dateTo));
      let numberOfRecord = this.filterForm.value.numberOfRecord;
      let userData = this.localStorageService.getLocalStorage('token');
      if(!dateFrom){
        
      }else if(!dateTo){
        let dateTo = this.dateFormatService.formatDate(new Date(this.defaultToday));
        this.listTicketService.getListTicket(userData.token, { status: ['CONFIRM', 'REJECT'], from: dateFrom, to: dateTo, cost: true, pageSize: numberOfRecord }).subscribe(res=>{
          this.setList(res);
        });
      }else{
        if(dateFrom<=dateTo){
          console.log('Hợp lệ. Call API');
          this.listTicketService.getListTicket(userData.token, { status: ['CONFIRM', 'REJECT'], from: dateFrom, to: dateTo, cost: true, pageSize: numberOfRecord }).subscribe(res=>{
            this.setList(res);
          });
        }else{
          console.log('Ngày chốt không thể trước ngày bắt đầu');
        }
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

  disableFuture = (d: Date | null): boolean=>{
    const day = (new Date(d) || new Date());
    const today = new Date(this.defaultToday);
    if(today> day) return true;
    return false;
  }

  exportData(dataExport){
    let report = [];

    dataExport.data.forEach((ticket, index)=>{
      let information = {
        'Tên người được bảo hiểm': ticket.fullname,
        'Ngày tháng năm sinh': this.dateFormatService.originFormatDate(ticket.dob),
        'CMND': ticket.cmnd,
        'Số hợp đồng': ticket.policy_no,
        'Công ty bảo hiểm': this.insurers[ticket.isurance_id-1].name,
        'Mã Định Danh': ticket.ID,
        'Case number': ticket.note,
        'Ngày xảy ra sự kiện': this.datePipe.transform(ticket.created_at, 'dd/MM/yyyy HH:mm:ss'),
        'Ngày kết thúc sự kiện': this.datePipe.transform(this.nextDay.transform(ticket.created_at), 'dd/MM/yyyy HH:mm:ss'),
        'Chi phí phát sinh': this.countTotal(ticket.hospitalCosts.costs).toString(),
        'Chi phí bảo lãnh': ticket.insmartCosts ? this.countTotal(ticket.insmartCosts.costs).toString() : '',
        'Loại hình bảo lãnh': 'Outpatient Claim',
        'Chẩn đoán': ticket.insmartCosts ? ticket.insmartCosts.cost_details.diag_note : ticket.hospitalCosts.cost_details.diag_note,
        'Cơ sở y tế': ticket.hospital_user.hospital.hospital_name,
        'Thời gian bổ sung cuối cùng': '',
        'Thời gian xác nhận bảo lãnh': this.datePipe.transform(this.nextDay.transform(ticket.updated_at), 'dd/MM/yyyy HH:mm:ss'),
        'Trạng Thái Bảo Lãnh': ticket.insmart_status,
        'Lý do từ chối': ticket.insmart_status === 'REJECT' ? ticket.reason.reasons : '',
        'Tên nhân viên xác nhận': ticket.insmart_user.fullname
      };
      
      // arr = [
      //   ticket.fullname,
      //   this.dateFormatService.originFormatDate(ticket.dob),
      //   ticket.cmnd,
      //   ticket.policy_no,
      //   this.insurers[ticket.isurance_id-1].name,
      //   ticket.ID,
      //   this.datePipe.transform(ticket.created_at, 'dd/MM/yyyy HH:mm:ss'),
      //   this.datePipe.transform(this.nextDay.transform(ticket.created_at), 'dd/MM/yyyy HH:mm:ss'),
      //   this.countTotal(ticket.hospitalCosts.costs).toString(),
      //   ticket.insmartCosts ? this.countTotal(ticket.insmartCosts.costs).toString() : '',
      //   'Outpatient Claim',
      //   ticket.insmartCosts ? ticket.insmartCosts.cost_details.diag_note : '',
      //   ticket.note,
      //   ticket.hospital_user.hospital.hospital_name,
      //   '',
      //   this.datePipe.transform(this.nextDay.transform(ticket.updated_at), 'dd/MM/yyyy HH:mm:ss'),
      //   ticket.insmart_status,
      //   ticket.insmart_status === 'REJECT' ? ticket.reason.reasons : '',
      //   ticket.insmart_user.fullname
      // ]
      report.push(information);
    });

    this.exportDataService.exportAsExcelFile(report, 'hospitalPortal');
  }
}

export interface Report{
  fullname:string;
  dob: string;
  cmnd: string;
  policy: string;
  insurance_id: string;
  id: number;
  note: string;
  created_at: string;
  expired_at: string;
  hosCost: string;
  insCost: string;
  typeOfDirectBilling: string;
  diag_note: string;
  hospital_name:string;
  lasttime_bs: string;
  time_action: string;
  status_directbilling: string;
  reason_reject: string;
  insmart_staff: string;
}