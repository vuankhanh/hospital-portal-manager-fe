import { Injectable, Inject } from '@angular/core';

import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  
  constructor(
    @Inject(LOCAL_STORAGE)
    private storage: StorageService
  ) {}

  setLocalStorage(key:string, value:any){
    return this.storage.set(key, value);
  }

  getLocalStorage(key:string){
    return this.storage.get(key);
  }

  checkExistLocalStorage(key:string){
    return this.storage.has(key);
  }

  removeLocalStorage(key:string){
    return this.storage.remove(key);
  }
}
