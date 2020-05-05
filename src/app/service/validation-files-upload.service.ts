import { Injectable } from '@angular/core';
import { UrlAttachmentPipe } from '../pipes/url-attachment.pipe';

@Injectable({
  providedIn: 'root'
})
export class ValidationFilesUploadService {

  groupAllowExtension = {
    image: [ 'jpg', 'jpeg', 'png', 'gif' ],
    pdf: [ 'pdf' ],
    tiff: [ 'tiff', 'tif' ],
    word: [ 'doc', 'docx' ],
    excel: [ 'xls', 'xlsx' ]

  }
  constructor(
    private urlAttachmentPipe: UrlAttachmentPipe
  ) { }

  checkValidator(fileName: string){
    let checkQuantityDot = fileName.split('.');
    if(checkQuantityDot.length>2){
      return false;
    }else{
      let checkCharacter = checkQuantityDot[0].match(/[^a-zA-Z0-9 ]+/);
      let checkSpace = /\s/g.test(checkQuantityDot[0]);

      if((checkCharacter && checkCharacter.length>0) || checkSpace){
        return false;
      }
      return true;
    }
  }

  getTailExtension(fileName: string){
    return fileName.split('.')[fileName.split('.').length-1];
  }

  pipeImageUrl(url){
    if(url){
      let urlShow;
      let fileExtension = this.getTailExtension(url);
      let groupAllowExtension = this.groupAllowExtension;
  
      if(groupAllowExtension.image.includes(fileExtension)){
        urlShow = this.urlAttachmentPipe.transform(url);
      }else if(groupAllowExtension.pdf.includes(fileExtension)){
        urlShow = './assets/imgs/icon/pdf.svg';
      }else if(groupAllowExtension.tiff.includes(fileExtension)){
        urlShow = './assets/imgs/icon/tiff.svg';
      }else if(groupAllowExtension.word.includes(fileExtension)){
        urlShow = './assets/imgs/icon/microsoft-word.svg';
      }else if(groupAllowExtension.excel.includes(fileExtension)){
        urlShow = './assets/imgs/icon/microsoft-excel.svg';
      }
      return { urlShow: urlShow, urlUpload:url, type: this.getTypeOfFile(url) }
    }
  }

  getTypeOfFile(file){
    let splitFile = file.split(".");
    return splitFile[splitFile.length-1];
  }
}
