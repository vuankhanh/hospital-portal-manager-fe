import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastrService: ToastrService
  ) { }

  showShortToast(message:string, title: string){
    return this.toastrService.show(message, title, {
      timeOut: 2000,
      positionClass: 'toast-bottom-left'
    })
  }
}
