import { Injectable } from '@angular/core';

import { Http, ResponseContentType } from '@angular/http';
import * as fileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(
    private http: Http
  ) { }

  async downloadFile(file): Promise<any>{		
		return await this.http.get(file, {responseType: ResponseContentType.Blob}).toPromise().then(res=>this.saveFile(res));
  }

  saveFile(response){
    let blob:any = new Blob([response.blob()], { type: response._body.type });
    let fileName = response.url.split('/')[response.url.split('/').length-1];
    fileSaver.saveAs(blob, fileName);
  }
}
