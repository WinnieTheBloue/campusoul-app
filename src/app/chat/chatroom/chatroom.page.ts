import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatchService } from 'src/app/services/match.service';
import { MessagesService } from 'src/app/services/messages.service';
import { PhotoService } from 'src/app/services/photo.service';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.page.html',
  styleUrls: ['./chatroom.page.scss'],
})
export class ChatroomPage implements OnInit {
  match: any = {}
  message?: string;
  matchId?: any
  messages: any[] = []
  userId: any = '';

  constructor(private route: ActivatedRoute, private messagesService: MessagesService, private authService: AuthService, private matchService: MatchService, private photoService: PhotoService, private webSocketService: WebSocketService) { }

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
  
  handleNewMessage(newMessage: any) {
    // Logique de traitement du nouveau message WebSocket
    const newMessageMatchId = newMessage.newChatMessage.match;
    if (newMessageMatchId !== this.matchId) return;
    this.loadMessages();
  }

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

  
loadUserPhoto(id: string): Promise < any > {
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

sendMessage() {
  if (!this.message) return console.error('Message vide')
  const body = {
    matchId: this.matchId,
    content: this.message
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
