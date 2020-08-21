import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NextDayPipe } from '../../pipes/next-day.pipe';
import { FormGroup, FormBuilder } from '@angular/forms';

import { LocalStorageService } from '../../service/local-storage.service';
import { DateFormatService } from '../../service/date-format.service';
import { TraTuService } from '../../service/tra-tu.service';
import { ExportDataService } from '../../service/export-data.service';
import { TicketsService } from '../../service/api/get/tickets.service';
import { InsurersService, Insurers } from '../../service/api/get/insurers.service';

import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent implements OnInit {
  filterForm: FormGroup;

  insurers: Insurers;

  defaultToday: number = Date.now();

  constructor(
    private datePipe: DatePipe,
    private nextDay: NextDayPipe,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private dateFormatService: DateFormatService,
    public traTuService: TraTuService,
    private insurersService: InsurersService,
    private exportDataService: ExportDataService,
    private ticketsService: TicketsService
  ) {
    let userData = this.localStorageService.getLocalStorage("token");
    this.insurersService.getHospital(userData.token).subscribe(res=>{
      if(res.data){
        this.insurers = res.data;
      }
    });
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.filterForm = this.formBuilder.group({
      isToday: false,
      dateFrom: this.dateFormatService.previousDay(this.defaultToday),
      dateTo: this.dateFormatService.formatDate(this.defaultToday),
      insurer_id: 'all'
    });

    this.filterForm.valueChanges.subscribe(valueChanged=>{
      this.validationStage(valueChanged);
    })
  }

  filterData(){
    if(this.filterForm.valid){
      let userData = this.localStorageService.getLocalStorage('token');
      let dateFrom = this.dateFormatService.formatDate(new Date(this.filterForm.value.dateFrom));
      let dateTo = this.dateFormatService.formatDate(new Date(this.filterForm.value.dateTo));
      
      let params = {
        from: dateFrom,
        to: dateTo,
        insurer_id: this.filterForm.value.insurer_id,
        isToday: this.filterForm.value.isToday
      }

      combineLatest(this.insurersService.getHospital(userData.token), this.ticketsService.getInsmart(userData.token, params)).subscribe(result=>{
        if(result[0].code === 200 && result[1].code === 200){
          let insurerResponse = result[0];
          let ticketResponse = result[1];
  
          this.insurers = insurerResponse.data;

          for(let ticket of ticketResponse.data){
            for(let comment of ticket.detailTicket){
              if(comment.type === 'CHANGE_STATUS'){
                let content = JSON.parse(comment.content);
                ticket.reasonReject = content.reasons;
                ticket.insmartRejectAt = comment.created_at;
              }else if(comment.type === 'INSMART_UPDATE_COST'){
                let cost = JSON.parse(comment.content);
                ticket.insmartCosts = cost;
                ticket.insmartUpdatedCostAt = comment.created_at;
              }else if(comment.type === 'REQUEST_COST'){
                let cost = JSON.parse(comment.content);
                ticket.hospitalCosts = cost;
                ticket.hospitalUpdatedCostAt = comment.created_at;
              }else if(comment.type === 'COMMENT'){
                if(comment.hospital_user_id>0){
                  ticket.lastAddition = comment.created_at;
                }
              }
            }
          }
          console.log(ticketResponse);
          this.exportData(ticketResponse);
        }
      },err=>{
        console.log(err);
      })
    }
  }

  validationStage(valueChanged){
    let dateFrom = this.dateFormatService.formatDate(new Date(valueChanged.dateFrom));
    let dateTo = this.dateFormatService.formatDate(new Date(valueChanged.dateTo));
    if(dateFrom<dateTo){
      console.log('Hợp lệ. Call API');
    }else{
      console.log('Đây là ngày hôm nay mà');
      console.log('Ngày chốt không thể trước ngày bắt đầu');
      this.filterForm.get('dateFrom').setValue(this.dateFormatService.previousDay(new Date(valueChanged.dateTo)));
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
        'Ngày xảy ra sự kiện': this.datePipe.transform(ticket.created_at, 'dd/MM/yyyy'),
        'Ngày kết thúc sự kiện': this.datePipe.transform(this.nextDay.transform(ticket.updated_at), 'dd/MM/yyyy'),
        'Chi phí phát sinh': ticket.hospitalCosts ? this.countTotal(ticket.hospitalCosts.costs).toString() : '',
        'Chi phí bảo lãnh': ticket.insmartCosts ? this.countTotal(ticket.insmartCosts.costs).toString() : '',
        'Loại hình bảo lãnh': 'Outpatient Claim',
        'Chẩn đoán': ticket.insmartCosts ? ticket.insmartCosts.cost_details.diag_note : ticket.hospitalCosts ? ticket.hospitalCosts.cost_details.diag_note : '',
        'Cơ sở y tế': ticket.hospitalInfo.hospital_name,
        'Thời gian tạo yêu cầu kiểm tra quyền lợi': this.datePipe.transform(ticket.created_at, 'dd/MM/yyyy HH:mm:ss'),
        'Thời gian bổ sung cuối cùng': this.datePipe.transform(ticket.lastAddition, 'dd/MM/yyyy HH:mm:ss'),
        'Thời gian CSYT cập nhật yêu cầu BLVP': this.datePipe.transform(ticket.hospitalUpdatedCostAt, 'dd/MM/yyyy HH:mm:ss'),
        'Thời gian xác nhận bảo lãnh': this.datePipe.transform(ticket.insmart_status === 'CONFIRM' ? ticket.insmartUpdatedCostAt : ticket.insmartRejectAt, 'dd/MM/yyyy HH:mm:ss'),
        'Thời gian gửi duyệt CTBH': '',
        'Thời gian CTBH duyệt': '',
        'Trạng Thái Bảo Lãnh': ticket.insmart_status,
        'Lý do từ chối': ticket.insmart_status === 'REJECT' ? ticket.reasonReject : '',
        'Tên nhân viên xác nhận': ticket.insmartUser.fullname,
        'Ngày Insmart nhận hồ sơ': '',
        'Ngày chuyển khoản': '',
        'Nội dung thanh toán': ''
      };
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
  reasonReject: string;
}