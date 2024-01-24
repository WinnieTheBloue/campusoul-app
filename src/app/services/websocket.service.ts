import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket;
  private messagesSubject: Subject<any> = new Subject();

  constructor(private toastController: ToastController, private authService: AuthService) {
    this.socket = new WebSocket('wss://campusoul-hrim.onrender.com');

    this.socket.addEventListener('open', (event) => {
      console.log('WebSocket ouvert');
    });

    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      // console.log(message.newChatMessage.sender)
      if(message.newChatMessage.sender != this.authService.getId()) {
        this.presentToast(message.newChatMessage.content);
      }
      // console.log('Message reçu : ', message.newChatMessage.content);
      
      this.messagesSubject.next(message);
    });

    this.socket.addEventListener('close', (event) => {
      console.log('WebSocket fermé');
    });
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }

  getMessages(): Observable<any> {
    return this.messagesSubject.asObservable();
  }
}