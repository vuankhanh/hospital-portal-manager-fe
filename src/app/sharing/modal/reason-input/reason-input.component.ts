import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, ThemePalette, ProgressSpinnerMode } from '@angular/material';

import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-reason-input',
  templateUrl: './reason-input.component.html',
  styleUrls: ['./reason-input.component.scss']
})
export class ReasonInputComponent implements OnInit, OnDestroy {
  reason: string='';

  showWarning: boolean;

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 0;

  numberCountDown:number = 4;

  countDownSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<ReasonInputComponent>
  ) { }

  ngOnInit() {
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  typingChange(event){
    console.log(event);
    this.showWarning = false;
  }

  confirmAction(){
    if(this.reason.length <= 10){
      this.showWarning = true;
    }else{
      this.countDownSubscription = interval(100).pipe(take(40)).subscribe(time=>{
        this.value += 2.5;
        if(this.value%25===0){
          this.numberCountDown--;
        }

        if(this.numberCountDown===0){
          this.dialogRef.close(this.reason);
        }
      });
    }
  }

  ngOnDestroy(){
    if(this.countDownSubscription){
      this.countDownSubscription.unsubscribe();
    }
  }
}
