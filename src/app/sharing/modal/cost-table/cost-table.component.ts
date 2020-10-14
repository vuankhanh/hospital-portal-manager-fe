import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cost-table',
  templateUrl: './cost-table.component.html',
  styleUrls: ['./cost-table.component.scss']
})
export class CostTableComponent implements OnInit {
  elementCost: any;
  displayedColumns: [];
  constructor() { }

  ngOnInit() {
  }

  countTotal(arrayNumber:any){
    let total = 0;
    arrayNumber.forEach(element=>{
      total += parseInt(element.cost_amount);
    });
    return total;
  }

}
