import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectBillingService {
  storageProccessDirectBilling:any=[];
  listentDirectBilling$: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(this.storageProccessDirectBilling);
  constructor() {

  }

  setProccessDirectBilling(directBilling:any){
    this.storageProccessDirectBilling.push(directBilling);
    this.listentDirectBilling$.next(this.storageProccessDirectBilling);
  }
}
