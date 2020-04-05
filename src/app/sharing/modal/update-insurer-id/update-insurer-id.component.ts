import { Component, OnInit } from '@angular/core';
import { RequestForRefundFormService } from '../../../service/request-for-refund-form.service';

@Component({
  selector: 'app-update-insurer-id',
  templateUrl: './update-insurer-id.component.html',
  styleUrls: ['./update-insurer-id.component.scss']
})
export class UpdateInsurerIdComponent implements OnInit {
  insurers: any = [];
  constructor(
    private requestForRefundFormService: RequestForRefundFormService
  ) { }

  ngOnInit() {
    this.insurers = this.requestForRefundFormService.insurers;
  }

}
