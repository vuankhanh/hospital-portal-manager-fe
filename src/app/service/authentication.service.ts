import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { LocalStorageService } from './local-storage.service';

const keyStorageToken:string = 'token';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

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
