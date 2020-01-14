import { Injectable } from '@angular/core';

import { ClipboardService } from 'ngx-clipboard';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CopyService {

  constructor(
    private clipboardService: ClipboardService,
    private toastService: ToastService
  ) { }

  createCopy(key:string, content:string,){
    return new Promise((resolve, reject)=>{
      let check:boolean = this.clipboardService.copyFromContent(content);
      check ? resolve('Đã sao chép') : reject('Đã có lỗi xảy ra');
    }).then(success=>{
      this.toastService.showShortToast(success+' '+key, 'Tiêu đề');
    }).catch(err=>this.toastService.showShortToast('Lỗi Cmnr', 'Tiêu đề'))
  }
}
