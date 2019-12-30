import { Component, OnInit } from '@angular/core';

import { TabPageService } from 'src/app/service/tab-page.service';
@Component({
  selector: 'app-directbilling',
  templateUrl: './directbilling.component.html',
  styleUrls: ['./directbilling.component.scss']
})
export class DirectbillingComponent implements OnInit {
  badgeRefundRequest: number;
  constructor(
    public tabPageService: TabPageService
  ) { }

  ngOnInit() {
    this.tabPageService.getBadgeRefundRequest().subscribe(badge=> this.badgeRefundRequest = badge);
  }

  onTabChanged(event){
    console.log(event);
  }
}
