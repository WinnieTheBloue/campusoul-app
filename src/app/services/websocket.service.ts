import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket;
  private messagesSubject: Subject<any> = new Subject();

  constructor(private toastController: ToastController, private authService: AuthService, private router: Router, private userService: UserService) {
    this.socket = new WebSocket('wss://campusoul-hrim.onrender.com');

    this.socket.addEventListener('open', (event) => {
      console.log('WebSocket ouvert');
    });

    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);

      if (message.newChatMessage) {
        if (message.newChatMessage.sender != this.authService.getId()) {
          this.userService.getUserProfile(message.newChatMessage.sender).subscribe((user) => {
            const sender = user.user.name;
            this.presentToast(message.newChatMessage.content, message.newChatMessage.match, sender);
          });

        }
      }
      if (message.newMatch) {
        message.newMatch.users.forEach((user: any) => {
          if (user != this.authService.getId()) {
            this.userService.getUserProfile(user).subscribe((user) => {
              const sender = user.user.name;
              this.presentToast('Nouveau match !', message.newMatch._id, sender);
            });
          }
        })

      }


      this.messagesSubject.next(message);
    });

    this.socket.addEventListener('close', (event) => {
      console.log('WebSocket fermé');
    });
  }


  async presentToast(message: string, matchId: string, sender: string) {
    const toast = await this.toastController.create({
      message: `${sender} : ${message}`,
      duration: 3000,
      position: 'top',
      color: 'primary',
      buttons: [{
        side: 'end',
        role: 'see',
        icon: 'eye',
        handler: () => {
          this.router.navigate([`/chat/chatroom/${matchId}`]);
        },
      }]


    });

    await toast.present();

  }

  getMessages(): Observable<any> {
    return this.messagesSubject.asObservable();
  }
}