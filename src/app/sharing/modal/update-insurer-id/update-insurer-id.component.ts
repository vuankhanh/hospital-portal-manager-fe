import { Component, OnInit, Inject } from '@angular/core';
import { RequestForRefundFormService } from '../../../service/request-for-refund-form.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-update-insurer-id',
  templateUrl: './update-insurer-id.component.html',
  styleUrls: ['./update-insurer-id.component.scss']
})
export class UpdateInsurerIdComponent implements OnInit {
  insurers: any = [];
  constructor(
    public dialogRef: MatDialogRef<UpdateInsurerIdComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private requestForRefundFormService: RequestForRefundFormService
  ) { }

  ngOnInit() {
    this.insurers = this.requestForRefundFormService.insurers;
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
