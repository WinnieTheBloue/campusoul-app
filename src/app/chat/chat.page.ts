import { Component, OnInit } from '@angular/core';
import { MatchService } from '../services/match.service';
import { AuthService } from '../services/auth.service';
import { PhotoService } from '../services/photo.service';
import { MessagesService } from '../services/messages.service';
import { last } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { WebSocketService } from '../services/websocket.service';

/**
 * Component for managing and displaying chat matches.
 * Handles loading matches, presenting chat options, and managing chat functionalities.
 */
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  /**
   * The array of matches to be displayed.
   * @type {any[]}
   */
  matches: any[] = []

  /**
   * The unique identifier of the current user.
   * @type {any}
   */
  userId: any = '';

  /**
   * Constructs the ChatPage component and injects necessary dependencies.
   * 
   * @param {MatchService} matchService - Service for handling match-related operations.
   * @param {WebSocketService} webSocketService - Service for managing WebSocket connections and communications.
   * @param {AuthService} authService - Service for handling authentication-related functionalities.
   * @param {PhotoService} photoService - Service for handling photo-related functionalities.
   * @param {MessagesService} messageService - Service for handling message-related operations.
   * @param {ActionSheetController} actionSheetCtrl - Controller for presenting a sheet of options.
   */
  constructor(private matchService: MatchService,
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private photoService: PhotoService,
    private messageService: MessagesService,
    private actionSheetCtrl: ActionSheetController) { }

  /**
 * On component initialization, loads the user ID, matches, and sets up WebSocket subscription for new events.
 */
  ngOnInit() {
    this.userId = this.authService.getId();
    this.loadMatches();

    this.webSocketService.getMessages().subscribe((newMessage) => {
      console.log(newMessage)
      if (newMessage.newMatch) {
        if (newMessage.newMatch.users.includes(this.authService.getId())) {
          this.newEvent();
        }
      }

      if (newMessage.newChatMessage) {
        console.log(newMessage.newChatMessage)
        console.log('???')
        console.log(newMessage.newChatMessage.receiver)
        console.log(this.authService.getId())
        console.log(newMessage.newChatMessage.receiver == this.authService.getId())
        if (newMessage.newChatMessage.receiver == this.authService.getId()) {
          this.newEvent();
        }
      }

    });
  }

  /**
   * Event handler for new events from WebSocket.
   * Reloads the matches when a new event occurs.
   */
  newEvent() {
    this.matches = [];
    this.loadMatches();
  }

  /**
   * Presents an action sheet with options for a match.
   * @param {string} matchId - The unique identifier of the match.
   */
  async presentActionSheet(matchId: string) {

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Options du match',
      buttons: [
        {
          text: 'Supprimer le match',
          role: 'destructive',
          handler: () => {
            this.deleteMatch(matchId);
          },
        },
        {
          text: 'Annuler',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }

  /**
   * Loads the matches and their associated last messages and unread messages count.
   */
  async loadMatches() {

    this.matchService.getAllMatches().subscribe(
      async (response) => {
        for (const match of response) {
          const lastMsg = await this.getLastMessage(match._id);
          const totalUnreadMessages = await this.getTotalUnreadMessages(match._id);
          let lastMsgSender = '0';
          let lastMsgContent = '';
          let lastMsgDate = '';
          let unreadMessages = '';
          if (lastMsg.length > 0) {
            lastMsgSender = lastMsg[0].sender;
            lastMsgContent = lastMsg[0].content;
            lastMsgDate = lastMsg[0].createdAt;
          }
          if (totalUnreadMessages > 0) {
            unreadMessages = totalUnreadMessages;
          }
          let mt = {}
          if (match.users[0]._id != this.userId) {
            const img = await this.loadUserPhoto(match.users[0].images[0]);
            mt = {
              matchId: match._id,
              name: match.users[0].name,
              id: match.users[0]._id,
              img: img,
              lastMsg: lastMsgContent,
              lastMsgSender: lastMsgSender,
              lastMsgDate: lastMsgDate,
              unreadMessages: unreadMessages
            }
          }
          if (match.users[1]._id != this.userId) {
            const img = await this.loadUserPhoto(match.users[1].images[0]);
            mt = {
              matchId: match._id,
              name: match.users[1].name,
              id: match.users[1]._id,
              img: img,
              lastMsg: lastMsgContent,
              lastMsgSender: lastMsgSender,
              lastMsgDate: lastMsgDate,
              unreadMessages: unreadMessages
            }
          }

          this.matches.push(mt);
        }
        this.matches.sort((a, b) => {
          const dateA = new Date(a.lastMsgDate);
          const dateB = new Date(b.lastMsgDate);

          if (dateA < dateB) {
            return 1;
          } else if (dateA > dateB) {
            return -1;
          } else {
            return 0;
          }
        });


      },
      (error) => {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      }
    );
  }

  /**
   * Retrieves the last message for a given match.
   * @param {string} id - The unique identifier of the match.
   * @returns {Promise<any>} A promise that resolves with the last message or rejects with an error.
   */
  getLastMessage(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.messageService.getLastMessage(id).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          console.error('Erreur lors du chargement des données utilisateur:', error);
          reject(error);
        }
      );
    });
  }

  /**
   * Retrieves the total count of unread messages for a given match.
   * @param {string} id - The unique identifier of the match.
   * @returns {Promise<any>} A promise that resolves with the total unread messages count or rejects with an error.
   */
  getTotalUnreadMessages(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.messageService.getTotalUnreadMessages(id).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          console.error('Erreur lors du chargement des données utilisateur:', error);
          reject(error);
        }
      );
    });
  }

  /**
   * Loads a user's photo by its ID.
   * @param {string} id - The ID of the photo to load.
   * @returns {Promise<any>} A promise that resolves with the photo URL or rejects with an error.
   */
  loadUserPhoto(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.photoService.getPhoto(id).subscribe(
        (response) => {
          resolve(response.url);
        },
        (error) => {
          console.error('Erreur lors du chargement des données utilisateur:', error);
          reject(error);
        }
      );
    });
  }

  /**
   * Deletes a match by its ID.
   * @param {string} matchId - The unique identifier of the match to delete.
   * @returns {Promise<any>} A promise that resolves upon successful deletion or rejects with an error.
   */
  deleteMatch(matchId: string) {
    return new Promise((resolve, reject) => {
      this.matchService.unMatch(matchId).subscribe(
        (response) => {
          this.matches = [];
          this.loadMatches();
          resolve(response);
        },
        (error) => {
          console.error('Erreur lors du chargement des données utilisateur:', error);
          reject(error);
        }
      );
    });
  }
}
