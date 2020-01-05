import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../service/login.service';
import { LocalStorageService } from '../service/local-storage.service';
import { TimelineOfRequestsService } from '../service/timeline-of-requests.service';

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
    private timeLineOfRequest: TimelineOfRequestsService,
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
      this.loginService.login(this.loginForm.value).subscribe(response=>{
        let res:any = response;
        this.localStorageService.setLocal('token', res.token)
        this.router.navigateByUrl('/dashboard');
      });
    }
  }
}
