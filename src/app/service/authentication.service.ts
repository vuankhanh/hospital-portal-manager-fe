import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { LocalStorageService } from './local-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

const keyStorageToken:string = 'token';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userInformation:any;
  listenUserInformation$: BehaviorSubject<any> = new BehaviorSubject<any>(this.userInformation);
  listenUserInformation: Observable<any> = this.listenUserInformation$.asObservable();
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }
  
  setUserInformation(info){
    this.userInformation = info;
    this.listenUserInformation$.next(this.userInformation);
  }

  // waitGetTokenAuthentication():Promise<UrlTree>{
  //   let url: string;
  //   let check:boolean = this.localStorageService.checkExistLocalStorage(token);

  //   let urlTree:Promise<UrlTree> = new Promise<UrlTree>((resolve)=>{
  //     if(!check){
  //       url = '/login'
  //     }
  //     const tree: UrlTree = this.router.parseUrl(url);
  //     resolve(tree);
  //   });
  //   return urlTree;
  // }

  skipLogin():Promise<UrlTree>{
    let url: string;
    let checkTokenExist:boolean = this.localStorageService.getLocalStorage(keyStorageToken);
    let urlTree:Promise<UrlTree> = new Promise<UrlTree>((resolve)=>{
      if(checkTokenExist){
        url = '/dashboard';
      }else{
        url = '/login'
      }
      const tree: UrlTree = this.router.parseUrl(url);
      resolve(tree);
    });
    return urlTree;
  }

  logout(){
    return this.localStorageService.removeLocalStorage(keyStorageToken);
  }
}
