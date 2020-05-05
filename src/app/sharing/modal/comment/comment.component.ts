import { Component, OnInit, Inject, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatMenuTrigger } from '@angular/material';

import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';
import { ImageShowComponent } from '../image-show/image-show.component';

import { UrlAttachmentPipe } from '../../../pipes/url-attachment.pipe';

import { LocalStorageService } from '../../../service/local-storage.service';
import { UpdateChatService } from '../../../service/api/put/update-chat.service';
import { DetailTicketService } from '../../../service/api/get/detail-ticket.service';
import { ListTicketsService } from '../../../service/list-tickets.service';
import { DownloadService } from '../../../service/download.service';

import { Subscription } from 'rxjs';
import { ValidationFilesUploadService } from '../../../service/validation-files-upload.service';
import { TraTuService } from '../../../service/tra-tu.service';
import { CopyService } from '../../../service/copy.service';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',  
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollMe', { static: false }) private contentContainer: ElementRef;
  @ViewChildren("messageContainer") messageContainers: QueryList<ElementRef>;
  @ViewChild(MatMenuTrigger,{static:false}) contextMenu: MatMenuTrigger;
  userData:any;

  messageConversation:string = '';
  attachments:any = [];
  contextMenuPosition = { x: '0px', y: '0px' };

  detailTickets:any =[];

  datePipe = new DatePipe('en-US');

  listenSocket$: Subscription;
  listentContainerChange$: Subscription;
  constructor(
    public dialogRef: MatDialogRef<CommentComponent>,
    @Inject(MAT_DIALOG_DATA) public IDticket: any,
    private dialog: MatDialog,
    private urlAttachmentPipe: UrlAttachmentPipe,
    private localStorageService: LocalStorageService,
    private updateChatService: UpdateChatService,
    private detailTicketService: DetailTicketService,
    private listTicketsService: ListTicketsService,
    private downloadService: DownloadService,
    private validationFilesUploadService: ValidationFilesUploadService,
    public traTuService: TraTuService,
    public copyService: CopyService
  ) {
    console.log(this.IDticket);
  }

  ngOnInit() {
    this.userData = this.localStorageService.getLocalStorage('token');
    this.setComment();
    this.listenSocket$ = this.listTicketsService.listenCommentTicket.subscribe(socketData=>{
      console.log(socketData);
      if(socketData && socketData.data.ticket_id === this.IDticket){
        this.setComment();
      }
    })
  }

  setComment(){
    this.detailTicketService.getDetailTicket(this.userData.token, this.IDticket).toPromise().then(comment=>{
      let comments:any = comment;
      
      if(comments.code === 200 && comments.message === 'OK'){
        comments.data.files = JSON.parse(comments.data.files);
        comments.data.costs = JSON.parse(comments.data.costs);
        this.detailTickets = comments.data;
        this.detailTickets.files = this.detailTickets.files.map(url=>{
          return this.validationFilesUploadService.pipeImageUrl(url);
        });
        for(let detailTicket of this.detailTickets.comments ){
          detailTicket.content = JSON.parse(detailTicket.content);
          if(detailTicket.content.files && detailTicket.content.files.length>0){
            detailTicket.content.files = detailTicket.content.files.map(url=>{
              return this.validationFilesUploadService.pipeImageUrl(url);
            });
          }
        }
        console.log(this.detailTickets);
        this.scrollToBottom();
      }
    }).catch(err=>{
      console.log(err);
    });
  }

  ngAfterViewInit(){
    this.scrollToBottom(); // For messsages already present
    this.listentContainerChange$ = this.messageContainers.changes.subscribe((list: QueryList<ElementRef>) => {
      this.scrollToBottom(); // For messages added later
    });
  }

  showImage(imageList, index){
    console.log(imageList);
    let data = {
      mainImage: index,
      images: imageList
    }
    this.dialog.open(ImageShowComponent, {
      data: data
    });
  }

  sendMessage(event, ticketId){

    if(this.messageConversation){
      this.userData = this.localStorageService.getLocalStorage('token');
      let comment = {
        content: this.messageConversation,
        files: this.attachments
      }

      if(comment.content.length > 0 || comment.files.length > 0){
        this.updateChatService.uploadComments(ticketId, this.userData.token, comment).then(res=>{
          let response:any = res;
          if(response.code === 200 && response.message==='OK'){
            response.data.content = JSON.parse(response.data.content);
            this.detailTickets.comments.push(response.data);
            this.messageConversation='';
            this.attachments = [];
          }
        },err=>{
          console.log(err);
          if(err.error.code === 421){
            if(err.error.message === 'Incorrect extension in filename'){
              alert('Lỗi đính kèm tệp! Tệp không đúng định dạng quy định');
            }else if(err.error.message === 'Ticket cannot processable! Action=INSMART_COMMENT'){
              alert('Bạn phải chờ phản hồi từ Bệnh Viện thì mới có thể tiếp tục yêu cầu thêm thông tin')
            }
          }
        });
      }
    }
  }

  onAttachmentSelect(event){
    // console.log(event);
    let files = event.target.files;
    if(files.length>5){
      alert('Giới hạn là 5 tệp gửi kèm');
    }else{
      if(this.attachments.length + files.length > 5){
        alert('Chỉ thêm được ' + (5-this.attachments.length) +' nữa' );
      }else{
        for(let file of files){
          let check = this.validationFilesUploadService.checkValidator(file.name);
          if(check){
            let reader = new FileReader();
            reader.readAsDataURL(file); 
            reader.onload = (_event) =>{
              let urlShow;
              let fileExtension = this.validationFilesUploadService.getTailExtension(file.name);
              let groupAllowExtension = this.validationFilesUploadService.groupAllowExtension;

              if(groupAllowExtension.image.includes(fileExtension)){
                console.log(fileExtension);
                urlShow = reader.result
              }else if(groupAllowExtension.pdf.includes(fileExtension)){
                console.log(fileExtension);
                urlShow = './assets/imgs/icon/pdf.svg';
              }else if(groupAllowExtension.tiff.includes(fileExtension)){
                urlShow = './assets/imgs/icon/tiff.svg';
                console.log(fileExtension);
              }else if(groupAllowExtension.word.includes(fileExtension)){
                console.log(fileExtension);
                urlShow = './assets/imgs/icon/microsoft-word.svg';
              }else if(groupAllowExtension.excel.includes(fileExtension)){
                console.log(fileExtension);
                urlShow = './assets/imgs/icon/microsoft-excel.svg';
              }
              console.log(urlShow);
              this.attachments.push(
                { name: file.name, urlShow: urlShow, urlUpload:file }
              );
            }
          }else{
            alert('Tệp đính kèm không được nhiều hơn 1 dấu chấm, chứa khoảng trắng và ký tự đặc biệt.');
          }
        }
      }
    }
  }

  async downloadAttachments(urlsAttachmen){
    if(urlsAttachmen && urlsAttachmen.length>0){
      for(let urlAttachmen of urlsAttachmen){
        let url = this.urlAttachmentPipe.transform(urlAttachmen.urlUpload);
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

  onRightClick(event: MouseEvent, index: number){
    event.preventDefault();
    
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';

    this.contextMenu.menuData = { 'index': index };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  removeAttachment(index:number){
    console.log(index);
    this.attachments.splice(index, 1);
  }

  closeComment(){
    this.dialogRef.close();
  }

  ngOnDestroy(){
    this.listenSocket$.unsubscribe();
    this.listentContainerChange$.unsubscribe();
  }

}
