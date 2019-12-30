import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

const DEFAULT_WEBSOCKET_CONFIG: WebSocketSubjectConfig<any> = {
  url: 'ws://localhost:7777/wsi',
  deserializer: (e: MessageEvent) => e.data
};
const subject: WebSocketSubject<any> = webSocket(DEFAULT_WEBSOCKET_CONFIG);

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() {}

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
    return subject.next(message);
  }
}
