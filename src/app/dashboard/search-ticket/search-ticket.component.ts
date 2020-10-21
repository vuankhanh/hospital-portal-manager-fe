import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { LocalStorageService } from '../../service/local-storage.service';
import { TicketsService, Tickets, TicketList } from '../../service/api/get/tickets.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-search-ticket',
  templateUrl: './search-ticket.component.html',
  styleUrls: ['./search-ticket.component.scss']
})
export class SearchTicketComponent implements OnInit {
  idNumber: string;

  ticketGroup: FormGroup;

  tickets: TicketList;
  inProccessing: boolean = false;

  displayedColumns: string[] = ['ID', 'fullname', 'insmart_status', 'insurer_short_name', 'ill_cause',  'hospital_name', 'created_at', 'updated_at'];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private ticketsService: TicketsService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.initForm();
  }
  initForm(){
    this.ticketGroup = this.formBuilder.group({
      idTicket :[''],
      fullname :[''],
      patient_phone_numb: [''],
      cmnd: [''],
      dob: [''],
      policy_no: [''],
      note: ['']
    });
  }

  search(){
    this.inProccessing=!this.inProccessing;
    if(this.ticketGroup.valid){
      console.log(this.ticketGroup.value);
      
      let userData = this.localStorageService.getLocalStorage("token");
      this.ticketsService.getTickets(userData.token, this.ticketGroup.value).subscribe(result=>{
        if(result.code === 200){
          this.inProccessing=!this.inProccessing;
          this.tickets = result.data;
          console.log(this.tickets);
        }else if(result.code == 401){
          this.inProccessing=!this.inProccessing;
          // alert(result.message);
          this.toastService.showShortToast(result.message, 'Thông báo');
        }
      },err=>{
        this.inProccessing=!this.inProccessing;
        console.log(err);
      });
    }
  }

  showDetail(row){
    console.log(row);
    this.router.navigate(['dashboard/timeline-ticket', row.ID]);
  }

}
