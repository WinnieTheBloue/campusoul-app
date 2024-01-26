import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';

/**
 * Injectable service to manage WebSocket communications.
 * This service handles the connection, message reception and sending of messages via WebSocket.
 * It also integrates with the Ionic toast controller for user notifications.
 */
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  /**
   * WebSocket object to manage the connection.
   */
  private socket: WebSocket;

  /**
   * Subject to handle incoming messages as observable.
   */
  private messagesSubject: Subject<any> = new Subject();

  /**
   * Constructor initializes the WebSocket connection and sets up event listeners.
   * @param {ToastController} toastController - Controller for showing toast notifications.
   * @param {AuthService} authService - Service for authentication-related functionalities.
   * @param {Router} router - Angular Router for navigation.
   * @param {UserService} userService - Service for user-related functionalities.
   */
  constructor(private toastController: ToastController,
    private authService: AuthService,
    private router: Router,
    private userService: UserService) {
    this.socket = new WebSocket('wss://campusoul-hrim.onrender.com');

    this.socket.addEventListener('open', (event) => {
      console.log('WebSocket opened');
    });

    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);

      if (message.newChatMessage) {
        if (message.newChatMessage.sender != this.authService.getId()) {
          if (message.newChatMessage.receiver == this.authService.getId()) {
            this.userService.getUserProfile(message.newChatMessage.sender).subscribe((user) => {
              const sender = user.user.name;

              this.presentToast(message.newChatMessage.content, message.newChatMessage.match, sender);
            });
          }
        }
      }
      if (message.newMatch) {
        if (message.newMatch.users.includes(this.authService.getId())) {
          message.newMatch.users.forEach((user: any) => {
            if (user != this.authService.getId()) {
              this.userService.getUserProfile(user).subscribe((user) => {
                const sender = user.user.name;

                this.presentToast('New match!', message.newMatch._id, sender);
              });
            }
          })
        }
      }

      this.messagesSubject.next(message);
    });

    this.socket.addEventListener('close', (event) => {
      console.log('WebSocket closed');
    });
  }

  /**
   * Presents a toast notification to the user.
   * @param {string} message - The message to be shown in the toast.
   * @param {string} matchId - The ID of the match or chat room.
   * @param {string} sender - The name of the sender of the message.
   */
  async presentToast(message: string, matchId: string, sender: string) {
    const toast = await this.toastController.create({
      message: `${sender}: ${message}`,
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

  /**
   * Returns an observable of message events.
   * @returns {Observable<any>} Observable that emits message events.
   */
  getMessages(): Observable<any> {
    return this.messagesSubject.asObservable();
  }
}
