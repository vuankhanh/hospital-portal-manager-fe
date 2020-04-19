import { Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { ProgressSpinnerMode, ThemePalette } from '@angular/material';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LocalStorageService } from '../../../service/local-storage.service';
import { DetailTicketService } from '../../../service/api/get/detail-ticket.service';

@Component({
  selector: 'app-confirm-action',
  templateUrl: './confirm-action.component.html',
  styleUrls: ['./confirm-action.component.scss']
})
export class ConfirmActionComponent implements OnInit, OnDestroy {
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 0;

  numberCountDown:number = 4;

  displayedColumns: string[] = ['category', 'money', 'note'];

  countDownSubscription: Subscription;
  constructor(
    public dialogRef: MatDialogRef<ConfirmActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private localStorageService: LocalStorageService,
    private detailTicketService: DetailTicketService
  ) {}

  ngOnInit() {
    console.log(this.data);
    let userData = this.localStorageService.getLocalStorage('token');
    this.detailTicketService.getDetailTicket(userData.token, this.data.ID).subscribe(res=>{
      let response:any = res;
      console.log(response);
      if(response.code === 200 && response.message ==='OK'){
        let countHospitalUpdate:number = 0;
        response.data.comments.forEach(comment=>{
          if(comment.type === 'REQUEST_COST'){
                
            if(comment.hospital_user_id > 0){
              // requestForRefund.insmartCosts = JSON.parse(comment.content).costs;
              // requestForRefund.diag_note = JSON.parse(comment.content).cost_details.diag_note;
              // requestForRefund.maximum_claim_value = JSON.parse(comment.content).cost_details.maximum_claim_value;
              // requestForRefund.social_insurance_id = JSON.parse(comment.content).cost_details.social_insurance_id;
              // requestForRefund.is_apply_social_insurance = JSON.parse(comment.content).cost_details.is_apply_social_insurance;
              this.data.hospitalCosts = JSON.parse(comment.content);
            }
            
          }
        });
      }
    })
  }

  countTotal(arrayNumber:any){
    if(arrayNumber && arrayNumber.length>0){
      let total = 0;
      
      arrayNumber.forEach(element=>{
        total += parseInt(element.cost_amount);
      });
      return total;
    }
  }

  onDispose(): void {
    this.dialogRef.close(false);
  }

  confirmAction(){
    this.countDownSubscription = interval(100).pipe(take(40)).subscribe(time=>{
      this.value += 2.5;
      if(this.value%25===0){
        this.numberCountDown--;
      }

      if(this.numberCountDown===0){
        this.dialogRef.close(true);
      }
    });
  }

  ngOnDestroy(){
    if(this.countDownSubscription){
      this.countDownSubscription.unsubscribe();
    }
  }

}
