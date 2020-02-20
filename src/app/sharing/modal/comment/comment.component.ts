import { Component, OnInit, Inject, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';

import { UrlAttachmentPipe } from '../../../pipes/url-attachment.pipe';

import { LocalStorageService } from '../../../service/local-storage.service';
import { UpdateChatService } from '../../../service/api/put/update-chat.service';
import { DetailTicketService } from '../../../service/api/get/detail-ticket.service';
import { ListTicketsService } from '../../../service/list-tickets.service';
import { DownloadService } from '../../../service/download.service';

import { Subscription } from 'rxjs';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',  
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollMe', { static: false }) private contentContainer: ElementRef;
  @ViewChildren("messageContainer") messageContainers: QueryList<ElementRef>;
  messageConversation:string = '';
  attachments:any = [];

  detailTickets:any =[];

  listenData$: Subscription;
  listenSocket$: Subscription;
  listentContainerChange$: Subscription;
  constructor(
    public dialogRef: MatDialogRef<CommentComponent>,
    @Inject(MAT_DIALOG_DATA) public ticket: any,
    private dialog: MatDialog,
    private urlAttachmentPipe: UrlAttachmentPipe,
    private localStorageService: LocalStorageService,
    private updateChatService: UpdateChatService,
    private detailTicketService: DetailTicketService,
    private listTicketsService: ListTicketsService,
    private downloadService: DownloadService
  ) {
    console.log(this.ticket);
  }

  ngOnInit() {
    let token = this.localStorageService.getLocalStorage('token');
    this.listenData$ = this.detailTicketService.getDetailTicket(token, this.ticket.ID).subscribe(comment=>{
      let comments:any = comment;
      console.log(comment);
      
      if(comments.code === 200 && comments.message === 'OK'){
        this.detailTickets = comments.data;
        for(let detailTicket of this.detailTickets.comments ){
          detailTicket.content = JSON.parse(detailTicket.content);
        }
        console.log(this.detailTickets);
        this.scrollToBottom();
      }
    });

    this.listenSocket$ = this.listTicketsService.listenCommentTicket.subscribe(comment=>{
      let comments: any = comment;
      if(comments && comments.id){
        console.log(comments);
        
        comments.content = JSON.parse(comments.content);
        if(comment.ticket_id === this.detailTickets.ID){
          this.detailTickets.comments.push(comment);
        }
      }
    });
  }

  ngAfterViewInit(){
    this.scrollToBottom(); // For messsages already present
    this.listentContainerChange$ = this.messageContainers.changes.subscribe((list: QueryList<ElementRef>) => {
      this.scrollToBottom(); // For messages added later
    });
  }

  sendMessage(event, ticketId){

    if(this.messageConversation){
      let token = this.localStorageService.getLocalStorage('token');
      let comment = {
        content: this.messageConversation,
        files: this.attachments
      }

      if(comment.content.length > 0 || comment.files.length > 0){
        this.updateChatService.uploadComments(ticketId, token, comment).then(res=>{
          let response:any = res;
          if(response.code === 200 && response.message==='OK'){
            response.data.content = JSON.parse(response.data.content);
            this.detailTickets.comments.push(response.data);
            console.log(response.data);
          }
        },err=>console.log(err));
      }
      this.messageConversation='';
      this.attachments = [];

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

  async downloadAttachments(urlsAttachmen){
    if(urlsAttachmen && urlsAttachmen.length>0){
      for(let urlAttachmen of urlsAttachmen){
        let url = this.urlAttachmentPipe.transform(urlAttachmen);
        console.log(url);
        await this.downloadService.downloadFile(url);
      }
    }
  }

  scrollToBottom(): void {
    try {
      this.contentContainer.nativeElement.scrollTop = this.contentContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  ngOnDestroy(){
    this.listenData$.unsubscribe();
    this.listenSocket$.unsubscribe();
    this.listentContainerChange$.unsubscribe();
  }

}
