import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InsurerDetailService, Insurers } from 'src/app/service/api/get/insurer-detail.service';
import { InsurerService } from 'src/app/service/api/post/insurer.service';
import { RemoveInsurerService } from 'src/app/service/api/post/remove-insurer.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { ToastService } from 'src/app/service/toast.service';
import { ConfirmActionComponent } from 'src/app/sharing/modal/confirm-action/confirm-action.component';
import { InsurerInformationComponent } from 'src/app/sharing/modal/insurer-information/insurer-information.component';
import { TraTuService } from '../../service/tra-tu.service';

@Component({
  selector: 'app-insurer-detail',
  templateUrl: './insurer-detail.component.html',
  styleUrls: ['./insurer-detail.component.scss']
})
export class InsurerDetailComponent implements OnInit {
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  private id: number;
  private subsciption: Subscription = new Subscription();
  insurerDetail: Insurers;
  constructor(
    private activedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private insurerDetailService: InsurerDetailService,
    private router: Router,
    private dialog: MatDialog,
    private insurerService: InsurerService,
    private removeInsurerService: RemoveInsurerService,
    public traTuService: TraTuService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.subsciption.add(
      this.activedRoute.params.subscribe(params => {
        this.id = params['id'];
      })
    );
    let userData = this.localStorageService.getLocalStorage('token');

    this.initData(userData.token, this.id);
  }

  initData(token, id) {
    this.insurerDetailService.getInsurer(token, id).subscribe(res => {
      this.insurerDetail = res.data;
    });
  }

  updateInsurer(row) {
    const dialog = this.dialog.open(InsurerInformationComponent, {
      data: row
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.dialog.open(ConfirmActionComponent).afterClosed().subscribe(password => {
          if (password) {
            result.password = password;
          }
          if (result && result.password) {
            delete result.information.created_at;
            let userToken = this.localStorageService.getLocalStorage("token");
            this.insurerService.updateInsurer(userToken.token, row.ID, result.password, result.information).subscribe(res => {
              this.toastService.showShortToast("Cập nhật dữ liệu thành công!", "Thông báo");
              // Re-rendering changes in the detail page
              for (const [key, value] of Object.entries(result.information)) {
                if (key == 'short_name') {
                  this.insurerDetail[0].short_name = value as string;
                } else if (key == 'name') {
                  this.insurerDetail[0].name = value as string;
                } else if (key == 'logo') {
                  this.insurerDetail[0].logo = value as string;
                } else if (key == 'type') {
                  this.insurerDetail[0].type = value as number;
                } else if (key == 'check_benefit_countdown') {
                  this.insurerDetail[0].check_benefit_countdown = value as number;
                } else if (key == 'gl_countdown') {
                  this.insurerDetail[0].gl_countdown = value as number;
                } else if (key == 'gl_countdown') {
                  this.insurerDetail[0].gl_countdown = value as number;
                }
              }
              // console.log(res);
            }, error => console.log(error));
          }
        });
      }
    });
  }

  deleteInsurer(insurer) {
    let userToken = this.localStorageService.getLocalStorage("token");
    this.dialog.open(ConfirmActionComponent).afterClosed().subscribe(password => {
      if (password) {
        this.removeInsurerService.removeInsurer(userToken.token, insurer.ID, password).subscribe(res => {
          if (res.code === 200) {
            this.router.navigate(['dashboard/insurance-management']).then(_ => {
              this.toastService.showShortToast(res.message, "Thông báo");
            })
          } else {
            this.toastService.showShortToast(res.message, "Thông báo");
          }
        });
      }
    });
    console.log(insurer);
  }
}
