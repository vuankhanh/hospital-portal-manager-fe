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
import { ActivatedRoute } from '@angular/router';
import { TimelineTicketService } from '../../service/api/get/timeline-ticket.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-timeline-ticket',
  templateUrl: './timeline-ticket.component.html',
  styleUrls: ['./timeline-ticket.component.scss']
})
export class TimelineTicketComponent implements OnInit {
  idNumber: string;

  tickets: Tickets;
  constructor(
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private ticketDetailService: TicketDetailService,
    private timelineTicketService: TimelineTicketService,
    private localStorageService: LocalStorageService,
    private exportDataService: ExportDataService,
    private dateFormatService: DateFormatService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get("id");
    this.search(id);
  }

  search(id){
    let userData = this.localStorageService.getLocalStorage("token");
    this.timelineTicketService.getTimelineTicket(userData.token, id).subscribe(result=>{
      if(result.code === 200){
        for(let ticket of result.data){
          for(let comment of ticket.detailTicket){
            comment.content = JSON.parse(comment.content);
          }
        }
        this.tickets = result.data;
        console.log(this.tickets);
      }else if(result.code == 401){
        // alert(result.message);
        this.toastService.showShortToast(result.message, 'Thông báo');
      }
    });
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
      'Hành động cuối cùng': this.datePipe.transform(ticket.updated_at, 'dd/MM/yyyy HH:mm:ss'),
    };
    report.push(information);

    this.exportDataService.exportAsExcelFile(report, 'hospitalPortal');
  }

}
