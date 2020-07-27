import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../service/api/post/login.service';
import { LocalStorageService } from '../service/local-storage.service';
import { ToastService } from '../service/toast.service';
import { AuthenticationService } from '../service/authentication.service';
import { TraTuService } from '../service/tra-tu.service';

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
    private toastService: ToastService,
    private authenticationService: AuthenticationService,
    private traTuService: TraTuService
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
      this.loginService.login(this.loginForm.value).subscribe(response=>{
        console.log(response);
        if(response.code === 200){
          this.localStorageService.setLocalStorage('token', response);
          this.authenticationService.setUserInformation(response);
          this.router.navigateByUrl('/dashboard');
        }else if(response.code === 500){
          this.toastService.showShortToast(response.message, 'Có lỗi xảy ra');
        }
      },err=>{
        this.toastService.showShortToast('Không xác định được lỗi '+err, 'Có lỗi xảy ra');
      });
    }
  }
}
