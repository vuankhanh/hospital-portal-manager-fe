import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';

import { ImageShowComponent } from '../../sharing/modal/image-show/image-show.component';

import { TicketDetailService } from '../../service/api/get/ticket-detail.service';

import { LocalStorageService } from '../../service/local-storage.service';
import { ExportDataService } from '../../service/export-data.service';
import { DateFormatService } from '../../service/date-format.service';
import { TicketsService, Tickets } from '../../service/api/get/tickets.service';

@Component({
  selector: 'app-timeline-ticket',
  templateUrl: './timeline-ticket.component.html',
  styleUrls: ['./timeline-ticket.component.scss']
})
export class TimelineTicketComponent implements OnInit {
  idNumber: string;

  ticketGroup: FormGroup;

  tickets: Tickets;
  constructor(
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private ticketDetailService: TicketDetailService,
    private ticketsService: TicketsService,
    private localStorageService: LocalStorageService,
    private exportDataService: ExportDataService,
    private dateFormatService: DateFormatService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.ticketGroup = this.formBuilder.group({
      idTicket :[''],
      fullname :[''],
    });
  }

  search(){
    if(this.ticketGroup.valid){
      
      let userData = this.localStorageService.getLocalStorage("token");
      this.ticketsService.getTickets(userData.token, this.ticketGroup.value).subscribe(result=>{
        if(result.code === 200){
          for(let ticket of result.data){
            for(let comment of ticket.detailTicket){
              comment.content = JSON.parse(comment.content);
            }
          }
          this.tickets = result.data;
          console.log(this.tickets);
        }else if(result.code == 401){
          alert(result.message);
        }
      });

      // this.ticketDetailService.getTicketDetail(userData.token, this.ticketGroup.value.idTicket).subscribe(result=>{
      //   if(result.code === 200){
      //     for(let comment of result.data.detailTicket){
      //       comment.content = JSON.parse(comment.content);
      //     }
      //     this.ticket = result.data;
          
      //   }else if(result.code == 401){
      //     alert(result.message);
      //   }
      // },err=>{
      //   console.log(err);
      // })
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

  download(ticket){
    this.exportData(ticket);
  }

  exportData(ticket){
    let report = [];

    let information = {
      'Trạng thái Ticket': ticket.insmart_status === 'VERIFIED' ?'Có Quyền Lợi' :
      ticket.insmart_status === 'DENIED' ? 'Không có quyền lợi' :
      ticket.insmart_status === 'CONFIRM' ? 'Đồng ý Bảo Lãnh' :
      ticket.insmart_status === 'REJECT' ? 'Từ chối Bảo Lãnh' : '',
      'Tên khách hàng': ticket.fullname,
      'Ngày sinh': this.datePipe.transform(ticket.dob, 'dd/MM/yyyy'),
      'Cty Bảo Hiểm': ticket.insurerInfo.short_name,
      'CMND/Passport': ticket.cmnd,
      'Số hợp đồng': ticket.policy_no,
      'Chẩn đoán': ticket.diag_note,
      'Tên CSYT': ticket.hospitalInfo.hospital_name,
      'Tên NV CSYT': ticket.hospital_employee_name,
      'SĐT NV CSYT': ticket.hospital_phone_number,
      'Mã CSYT': ticket.hospitalInfo.hospital_code,
    };
    report.push(information);

    this.exportDataService.exportAsExcelFile(report, 'hospitalPortal');
  }

}
