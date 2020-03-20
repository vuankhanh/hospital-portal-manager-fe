import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { PushSmsService } from '../../../service/api/post/push-sms.service';

@Component({
  selector: 'app-push-sms',
  templateUrl: './push-sms.component.html',
  styleUrls: ['./push-sms.component.scss']
})
export class PushSmsComponent implements OnInit {
  message:string;
  phoneNumber:string = '0842415921';
  constructor(
    public dialogRef: MatDialogRef<PushSmsComponent>,
    private pushSmsService: PushSmsService
  ) { }

  ngOnInit() {
  }
  
  testSms(){
    let encodeBase64:string = window.btoa(this.message);
    this.pushSmsService.authentication(encodeBase64, this.phoneNumber).then(res=>{
      // alert('Đã gửi thành công tin nhắn '+res.Message+' đến sđt '+res.Phone);
      console.log(res);
      this.dialogRef.close();
    }).catch(err=>console.log(err));
  }

  onNoClick(){
    this.dialogRef.close();
  }
}
