import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdateChatService {

  constructor(
    private httpClient: HttpClient
  ) { }

  uploadComments(idTicket:number, token:string, comment){
    let headers = new HttpHeaders({
      'Authorization':token
    });

    let formData = new FormData();
    if(comment.content){
      formData.append('content', comment.content);
      if(comment.files){
        for(let file of comment.files){
          formData.append('files', file.urlUpload);
        }
      }
    }

    return this.httpClient.put(environment.apiHost+'opd/'+idTicket+'/comments', formData, { headers: headers }).toPromise();
  }
}
