import { Component, OnInit } from '@angular/core';

import { TabPageService } from 'src/app/service/tab-page.service';
import { DirectbillingTheRequirementService } from '../../../service/directbilling-the-requirement.service';
@Component({
  selector: 'app-directbilling',
  templateUrl: './directbilling.component.html',
  styleUrls: ['./directbilling.component.scss']
})
export class DirectbillingComponent implements OnInit {
  badgeRefundRequest: number;
  constructor(
    public tabPageService: TabPageService,
    public directbillingTheRequirementService: DirectbillingTheRequirementService
  ) { }

  ngOnInit() {
  }

  onTabChanged(event){
    console.log(event);
  }
}
