import { NgModule } from '@angular/core'
import  { UrlAttachmentPipe } from '../../pipes/url-attachment.pipe';

@NgModule({
  imports:      [ ],
  declarations: [ UrlAttachmentPipe ],
  exports:    [ UrlAttachmentPipe ],
  providers:    [ UrlAttachmentPipe ]
})
export class SharedModule { }