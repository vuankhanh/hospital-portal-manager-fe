import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-reason-input',
  templateUrl: './reason-input.component.html',
  styleUrls: ['./reason-input.component.scss']
})
export class ReasonInputComponent implements OnInit {
  reason: string='';

  showWarning: boolean;
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

  validData(){
    if(this.reason.length <= 10){
      this.showWarning = true;
    }else{
      this.dialogRef.close(this.reason);
    }
  }
}
