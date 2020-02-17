import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';

import { LocalStorageService } from '../../../service/local-storage.service';
import { UpdateChatService } from '../../../service/api/put/update-chat.service';
import { DetailTicketService } from '../../../service/api/get/detail-ticket.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  messageConversation:string = '';
  attachments:any = [];

  detailTickets:any =[];
  constructor(
    public dialogRef: MatDialogRef<CommentComponent>,
    @Inject(MAT_DIALOG_DATA) public ticket: any,
    private dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private updateChatService: UpdateChatService,
    private detailTicketService: DetailTicketService
  ) {
    console.log(this.ticket);
  }

  ngOnInit() {
    let token = this.localStorageService.getLocalStorage('token');
    this.detailTicketService.getDetailTicket(token, this.ticket.ID).subscribe(comment=>{
      let comments:any = comment;
      console.log(comment);
      
      if(comments.code === 200 && comments.message === 'OK'){
        this.detailTickets = comments.data;
        for(let detailTicket of this.detailTickets.comments ){
          detailTicket.content = JSON.parse(detailTicket.content)
        }
        console.log(this.detailTickets);
      }
    })
  }

  sendMessage(event, ticketId){

    if(this.messageConversation){
      let token = this.localStorageService.getLocalStorage('token');
      let comment = {
        content: this.messageConversation,
        files: this.attachments
      }

      console.log(comment);
      if(comment.content.length > 0 || comment.files.length > 0){
        this.updateChatService.uploadComments(ticketId, token, comment).then(res=>{
          let response:any = res;
          if(response.code === 200 && response.message==='OK'){
            console.log(response.data);
          }
        },err=>console.log(err));
      }
      this.messageConversation='';

      // this.dialog.open(ConfirmActionComponent, {
      //   width: '500px',
      //   data: {
      //     title: 'Xác nhận',
      //     question: 'Bạn chắc chắn sẽ gửi Yêu Cầu Bổ Sung Thông Tin chứ ?',
      //     btnReject: 'Huỷ',
      //     btnConfirm: 'Chắc chắn!'
      //   }
      // }).afterClosed().subscribe(result=>{
      //   if(result){
      //     let token = this.localStorageService.getLocalStorage('token');
      //     let comment = {
      //       content: this.messageConversation='',
      //       files: this.attachments
      //     }
      //     if(comment.content.length > 0 || comment.files.length > 0){
      //       this.updateChatService.uploadComments(ticketId, token, comment).then(res=>{
      //         let response:any = res;
      //         if(response.code === 200 && response.message==='OK'){
      //           console.log(response.data);
      //         }
      //       })
      //     }
      //     this.messageConversation='';
      //   }else{
      //     console.log('Huỷ Modal');
          
      //   }
      // })
    }
  }

  onAttachmentSelect(event){
    console.log(event);
    let files = event.target.files;
    for(let file of files){
      let reader = new FileReader();
      reader.readAsDataURL(file); 
      reader.onload = (_event) =>{
        this.attachments.push(
          { name: file, urlShow: reader.result, urlUpload:file, description: '' }
        );
      }
    }
  }

}
