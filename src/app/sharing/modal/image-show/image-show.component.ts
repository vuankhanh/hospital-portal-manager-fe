import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DownloadService } from '../../../service/download.service';

import { UrlAttachmentPipe } from '../../../pipes/url-attachment.pipe';

@Component({
  selector: 'app-image-show',
  templateUrl: './image-show.component.html',
  styleUrls: ['./image-show.component.scss']
})
export class ImageShowComponent implements OnInit {
  typeImages = {
    image: ['png', 'jpg', 'jpeg', 'tiff', 'tif', 'gif'],
    document: ['doc', 'docx', 'xlsx', 'xls', 'pdf']
  }
  constructor(
    public dialogRef: MatDialogRef<ImageShowComponent>,
    @Inject(MAT_DIALOG_DATA) public images: any,
    public domSanitizer: DomSanitizer,
    private urlAttachmentPipe: UrlAttachmentPipe,
    private downloadService: DownloadService
  ) { }

  ngOnInit() {
    for(let i=0;i<this.images.images.length;i++){
      if(this.images.images[i].urlUpload && (typeof this.images.images[i].urlUpload) === 'string'){
        this.images.images[i].trustResourceUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/gview?url='+this.urlAttachmentPipe.transform(this.images.images[i].urlUpload)+'&embedded=true');
      }
    }
  }

  imageSelected(index){
    this.images.mainImage = index;
  }

  async downloadAll(images){
    if(images && images.length>0){
      for(let urlAttachmen of images){
        let url = this.urlAttachmentPipe.transform(urlAttachmen.urlUpload);
        await this.downloadService.downloadFile(url).catch(err=>{
          if(err.status === 400 && err.statusText === "Bad Request"){
            alert('Đã có lỗi xảy ra với đường dẫn File đính kèm');
          }
        });
      }
    }
  }
}
