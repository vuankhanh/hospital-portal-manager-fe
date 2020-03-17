import { Injectable } from '@angular/core';

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
  constructor() { }

  checkValidator(fileName: string){
    let check = fileName.split('.').length;
    if(check>2){
      return false;
    }
    return true;
  }

  getTailExtension(fileName: string){
    return fileName.split('.')[fileName.split('.').length-1];
  }
}
