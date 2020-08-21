import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { ImageShowComponent } from '../../sharing/modal/image-show/image-show.component';

import { TicketDetailService, Ticket } from '../../service/api/get/ticket-detail.service';
import { LocalStorageService } from '../../service/local-storage.service';

@Component({
  selector: 'app-timeline-ticket',
  templateUrl: './timeline-ticket.component.html',
  styleUrls: ['./timeline-ticket.component.scss']
})
export class TimelineTicketComponent implements OnInit {
  idNumber: string;

  ticketGroup: FormGroup;

  ticket: Ticket;
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private ticketDetailService: TicketDetailService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.ticketGroup = this.formBuilder.group({
      idTicket :['', Validators.required]
    });
  }

  search(){
    if(this.ticketGroup.valid){
      let userData = this.localStorageService.getLocalStorage("token");
      let idNumber = this.ticketGroup.value.idTicket;

      this.ticketDetailService.getTicketDetail(userData.token, idNumber).subscribe(result=>{
        if(result.code === 200){
          for(let comment of result.data.detailTicket){
            comment.content = JSON.parse(comment.content);
          }
          this.ticket = result.data;
          
        }else if(result.code == 401){
          alert(result.message);
        }
      },err=>{
        console.log(err);
      })
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

}
