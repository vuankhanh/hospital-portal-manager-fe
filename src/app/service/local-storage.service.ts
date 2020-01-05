import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setLocal(key, value) {
    return localStorage.setItem(key, value);

  }
  getLocal() {
    return localStorage.getItem('user')
  }
}
