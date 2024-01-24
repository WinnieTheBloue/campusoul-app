import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket;
  private messagesSubject: Subject<any> = new Subject();

  constructor() {
    this.socket = new WebSocket('wss://campusoul-hrim.onrender.com');

    this.socket.addEventListener('open', (event) => {
      console.log('WebSocket ouvert');
    });

    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      this.messagesSubject.next(message);
    });

    this.socket.addEventListener('close', (event) => {
      console.log('WebSocket fermé');
    });
  }

  getMessages(): Observable<any> {
    return this.messagesSubject.asObservable();
  }
}