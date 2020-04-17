import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DownloadService } from '../../../service/download.service';

import { UrlAttachmentPipe } from '../../../pipes/url-attachment.pipe';

@Component({
  selector: 'app-image-show',
  templateUrl: './image-show.component.html',
  styleUrls: ['./image-show.component.scss']
})
export class ImageShowComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ImageShowComponent>,
    @Inject(MAT_DIALOG_DATA) public images: any,
    private urlAttachmentPipe: UrlAttachmentPipe,
    private downloadService: DownloadService
  ) { }

  ngOnInit() {
    console.log(this.images);
  }

  imageSelected(index){
    this.images.mainImage = index;
  }

  async downloadAll(images){
    if(images && images.length>0){
      for(let urlAttachmen of images){
        let url = this.urlAttachmentPipe.transform(urlAttachmen.urlUpload);
        console.log(url);
        await this.downloadService.downloadFile(url);
      }
    }
  }
}
