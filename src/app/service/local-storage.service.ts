import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {}

  setLocalStorage(key, value) {
    return localStorage.setItem(key, value);
  }

  getLocalStorage(key) {
    return localStorage.getItem(key);
  }

  removeLocalStorage(key:string){
    return localStorage.removeItem(key);
  }
}
