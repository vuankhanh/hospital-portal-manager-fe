import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTable, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { CreateInsurerService } from 'src/app/service/api/post/create-insurer.service';
import { InsurerInformationComponent } from 'src/app/sharing/modal/insurer-information/insurer-information.component';

import { InsurersService, Insurers } from '../../service/api/get/insurers.service';
import { LocalStorageService } from '../../service/local-storage.service';
import { TraTuService } from '../../service/tra-tu.service';

@Component({
  selector: 'app-insurance-list-management',
  templateUrl: './insurance-list-management.component.html',
  styleUrls: ['./insurance-list-management.component.scss']
})
export class InsuranceListManagementComponent implements OnInit {
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  insurers: Insurers = [];
  pageSize:number = 10;
  pageIndex: number = 1;
  length:number;
  pageSizeOptions: number[] = [10, 25, 100];

  displayedColumns: string[] = ['id', 'short_name', 'name', 'logo', 'check_benefit_countdown', 'gl_countdown', 'type' ];
  constructor(
    private router: Router,
    private insurersService: InsurersService,
    private localStorageService: LocalStorageService,
    public traTuService: TraTuService,
    private dialog: MatDialog,
    private localStorageSerivce: LocalStorageService,
    private createInsurerService: CreateInsurerService
  ) { }

  ngOnInit() {
    let params = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    }
    this.setInsurer(params);
  }

  onSearchChange(event){
    let shortName = event.target.value;
    let params = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      shortName: shortName
    }

    this.setInsurer(params);
  }

  createInsurer(){
    return this.dialog.open(InsurerInformationComponent,{
      data: {}
    }).afterClosed().subscribe(result=>{
      if(result){
        let userData = this.localStorageSerivce.getLocalStorage("token");
        this.createInsurerService.createInsurer(userData.token, result.information).subscribe(res=>{          
          if(res.code === 200){
            alert(res.message);
            this.insurers.push(res.data[0]);
            this.length++;
            this.table.renderRows();
          }else if(res.code === 500){
            alert(res.message);
          }
        },error=>{
          console.log(error);
        })
      }
    });
  }

  setInsurer(params){
    let userInfo = this.localStorageSerivce.getLocalStorage('token');

    this.insurersService.getInsurer(userInfo.token, params).subscribe(res=>{
      this.insurers = res.data;
      this.length = res.length;
    },err=>alert(err));
  }

  pageChangeEvent(event: PageEvent){
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex+1;

    let params = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    }
    this.setInsurer(params);
  }

  showDetail(hospital){
    this.router.navigate(['/dashboard/insurer-detail', hospital.ID]);
  }
}