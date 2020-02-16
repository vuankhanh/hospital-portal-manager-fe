import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../service/api/post/login.service';
import { LocalStorageService } from '../service/local-storage.service';

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
    private localStorageService: LocalStorageService
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
          this.localStorageService.setLocalStorage('token', response.token);
          this.loginService.thenLogin(response.token);
          this.router.navigateByUrl('/dashboard');
        };
      });
    }
  }
}
