import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatchService } from 'src/app/services/match.service';
import { MessagesService } from 'src/app/services/messages.service';
import { PhotoService } from 'src/app/services/photo.service';
import { WebSocketService } from 'src/app/services/websocket.service';

/**
 * Component for displaying and handling a chat room.
 * Manages the retrieval and display of messages, the match's details, and sending new messages.
 */
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.page.html',
  styleUrls: ['./chatroom.page.scss'],
})
export class ChatroomPage implements OnInit {
  /**
   * The match object containing information about the match.
   * @type {any}
   */
  match: any = {}

  /**
   * The message being composed by the user.
   * @type {string | undefined}
   */
  message?: string;

  /**
   * The unique identifier of the match.
   * @type {any}
   */
  matchId?: any

  /**
   * The array of messages in the current chat.
   * @type {any[]}
   */
  messages: any[] = []

  /**
   * The unique identifier of the current user.
   * @type {any}
   */
  userId: any = '';

  /**
   * Constructs the ChatroomPage component and injects necessary dependencies.
   * 
   * @param {ActivatedRoute} route - The activated route that holds route parameters.
   * @param {MessagesService} messagesService - Service for handling message-related operations.
   * @param {AuthService} authService - Service for handling authentication-related functionalities.
   * @param {MatchService} matchService - Service for handling match-related operations.
   * @param {PhotoService} photoService - Service for handling photo-related functionalities.
   * @param {WebSocketService} webSocketService - Service for managing WebSocket connections and communications.
   */
  constructor(private route: ActivatedRoute,
    private messagesService: MessagesService,
    private authService: AuthService,
    private matchService: MatchService,
    private photoService: PhotoService,
    private webSocketService: WebSocketService) { }

  /**
   * On component initialization, loads the user ID, match ID, messages, and match details.
   * Also sets up WebSocket subscription for new messages.
   */
  ngOnInit() {
    this.userId = this.authService.getId();

    this.route.params.subscribe(params => {
      this.matchId = params['id'];
    });

    this.loadMessages()
    this.loadMatch()

    this.webSocketService.getMessages().subscribe((newMessage) => {
      this.handleNewMessage(newMessage);
    });
  }

  /**
   * Handles a new message received from the WebSocket.
   * Reloads the messages if the new message belongs to the current match.
   * @param {any} newMessage - The new message received.
   */
  handleNewMessage(newMessage: any) {
    const newMessageMatchId = newMessage.newChatMessage.match;
    if (newMessageMatchId !== this.matchId) return;
    this.loadMessages();
  }

  /**
   * Loads the match details.
   */
  loadMatch() {
    this.matchService.getMatch(this.matchId).subscribe(
      async (response) => {
        if (this.userId != response.users[0]._id) {
          const img = await this.loadUserPhoto(response.users[0].images[0]);
          this.match = {
            name: response.users[0].name,
            id: response.users[0]._id,
            img: img,
          }
        }

        if (this.userId != response.users[1]._id) {
          const img = await this.loadUserPhoto(response.users[1].images[0]);
          this.match = {
            name: response.users[1].name,
            id: response.users[1]._id,
            img: img,
          }

        }

      },
      (error) => {
        console.error('Erreur lors du chargement du match:', error);
      }
    );
  }

  /**
   * Loads the messages for the current match.
   */
  async loadMessages() {
    this.messagesService.getMessages(this.matchId).subscribe(
      (response) => {
        this.messages = response;
      },
      (error) => {
        console.error('Erreur lors du chargement des messages:', error);
      }
    );
  }

  /**
   * Marks messages as read.
   */
  async readMessages() {
    this.messagesService.readMessages(this.matchId).subscribe(
      (response) => {
        this.loadMessages();
      },
      (error) => {
        console.error('Erreur lors de la lecture des messages:', error);
      }
    );
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
    * Sends the composed message.
    */
  sendMessage() {
    if (!this.message) return console.error('Message vide')
    const body = {
      matchId: this.matchId,
      content: this.message,
      receiver: this.match.id
    }
    this.messagesService.sendMessage(body).subscribe(
      (response) => {
        this.loadMessages();
        this.message = '';
      },
      (error) => {
        console.error('Erreur lors de l\'envoi du message:', error);
      }
    );
  }
}
