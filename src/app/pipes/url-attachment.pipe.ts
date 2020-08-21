import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '../../environments/environment'
@Pipe({
  name: 'urlAttachment'
})
export class UrlAttachmentPipe implements PipeTransform {
  serverIp:string = environment.apiHost.substring(0, environment.apiHost.length-1);
  transform(url:string): string {
    console.log(url);
    let standardUrl = url.split("/");
    standardUrl.shift();

    standardUrl[0] = standardUrl[0]+"ed";
    standardUrl.unshift(this.serverIp);
    
    return standardUrl.join("/");
  }

}
