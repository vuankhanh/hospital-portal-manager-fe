import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CommentComponent } from '../sharing/modal/comment/comment.component';

import { PushNotificationsService} from 'ng-push';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private _pushNotifications: PushNotificationsService,
  ) {
    this._pushNotifications.requestPermission();
  }

  showNotificationComment(socketData){
    let types = ['TICKET', 'COMMENT', 'CHANGE_STATUS', ''];
    
    let body:string = '';
    if(socketData.data.type=== types[1]){
      let content = JSON.parse(socketData.data.content);
      body = content.message;
    }
    let options = { //set options
      body: body,
      icon: "assets/imgs/sheild.png" //adding an icon
    }
    this._pushNotifications.create(socketData.meta.sender_id+' đã trả lời ticket số '+socketData.data.ticket_id, options).subscribe( //creates a notification
      res =>{
        if(res.event.type === 'click'){
          this.ngZone.run(()=>{
            this.router.navigateByUrl('/dashboard/directbilling').then(_=>{
              window.focus();
              if(!this.dialog.getDialogById('commentBox')){
                this.dialog.open(CommentComponent,{
                  data: socketData.data.ticket_id,
                  id: 'commentBox'
                });
              }
            });
          })
          res.notification.close();
        }
      },err =>this._pushNotifications.requestPermission()
    );
  }
}
