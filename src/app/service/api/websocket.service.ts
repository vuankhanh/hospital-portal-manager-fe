import { Injectable } from '@angular/core';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

const DEFAULT_WEBSOCKET_CONFIG: WebSocketSubjectConfig<any> = {
  url: environment.socketHost,
  deserializer: (e: MessageEvent) => e.data
};
const subject: WebSocketSubject<any> = new WebSocketSubject(DEFAULT_WEBSOCKET_CONFIG);

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() {
    setInterval(()=>{
      this.emitMessage('ping');
    },45000)
  }

  listenWebSocket(){
    return Observable.create(observer => {
      try {
  
        const subscription = subject.asObservable().subscribe(data =>
          observer.next(data), 
          error => observer.error(error), 
          () => observer.complete()
        );
  
        return () => {
          if (!subscription.closed) {
            subscription.unsubscribe();
          }
        };
      } catch (error) {
        observer.error(error);
      }
    });
  };

  emitMessage(message:string){
    subject.next(message);
  }
}
