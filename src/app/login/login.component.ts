import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../service/api/post/login.service';
import { LocalStorageService } from '../service/local-storage.service';
import { ListTicketsService } from '../service/list-tickets.service';
import { ToastService } from '../service/toast.service';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    private listTicketsService: ListTicketsService,
    private toastService: ToastService,
    private authenticationService: AuthenticationService
  ) {

  }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.loginForm = this.formBuilder.group({
      user_name: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  doLogin(){
    if(this.loginForm.valid){
      this.loginService.login(this.loginForm.value).toPromise().then(response=>{
        if(response.code === 200 && response.message === 'OK'){
          this.localStorageService.setLocalStorage('token', response);
          this.authenticationService.setUserInformation(response);

          let userData = this.localStorageService.getLocalStorage('token');
          this.loginService.thenLogin(userData.token, userData.data.id).then(data=>{
            let datas: any = data;
            console.log(datas);
            if(datas[1].code === 200 && datas[1].message==='OK'){
              this.listTicketsService.getDirectBillingTaken(datas[1]);
            }
            if(datas[2].code === 200 && datas[2].message==='OK'){
              this.listTicketsService.getTicketsOpen(datas[2]);
            }
          }).catch(err=>{
            // this.router.navigate(['/login']);
            // console.log(err);
          });

          this.router.navigateByUrl('/dashboard');
        };
      }).catch(err=>{
        console.log(err);
        if(err.error.code === 421 && err.error.message === 'Co loi xay ra: record not found: Co loi xay ra: record not found'){
          this.toastService.showShortToast('Sai tài khoản hoặc mật khẩu', 'Có lỗi xảy ra');
        }
      });
    }
  }
}
