import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-case-number',
  templateUrl: './case-number.component.html',
  styleUrls: ['./case-number.component.scss']
})
export class CaseNumberComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CaseNumberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
