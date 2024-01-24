import { Component, OnInit } from '@angular/core';
import { MatchService } from '../services/match.service';
import { AuthService } from '../services/auth.service';
import { PhotoService } from '../services/photo.service';
import { MessagesService } from '../services/messages.service';
import { last } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  matches: any[] = []
  userId: any = '';
  constructor(private matchService: MatchService, private authService: AuthService, private photoService: PhotoService, private messageService: MessagesService) { }

  ngOnInit() {
    this.userId = this.authService.getId();
    this.loadMatches();
  }

  async loadMatches() {
    this.matchService.getAllMatches().subscribe(
      async (response) => {
        for (const match of response) {
          const lastMsg = await this.getLastMessage(match._id);
          let lastMsgSender = '0';
          let lastMsgContent = '';
          let lastMsgDate = '';
          if (lastMsg.length > 0) {
            lastMsgSender = lastMsg[0].sender;
            lastMsgContent = lastMsg[0].content;
            lastMsgDate = lastMsg[0].createdAt;
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
              lastMsgDate: lastMsgDate
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
              lastMsgDate: lastMsgDate
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

  getLastMessage(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.messageService.getLastMessage(id).subscribe(
        (response) => {
          console.log(response)
          resolve(response);
        },
        (error) => {
          console.error('Erreur lors du chargement des données utilisateur:', error);
          reject(error);
        }
      );
    });
  }

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
}
