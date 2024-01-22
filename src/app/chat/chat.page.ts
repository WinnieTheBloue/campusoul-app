import { Component, OnInit } from '@angular/core';
import { MatchService } from '../services/match.service';
import { AuthService } from '../services/auth.service';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  matches: any[] = []
  userId: any = '';
  constructor(private matchService: MatchService, private authService: AuthService, private photoService: PhotoService) { }

  ngOnInit() {
    this.userId = this.authService.getId();
    this.loadMatches();
  }

  async loadMatches() {
    this.matchService.getAllMatches().subscribe(
      async (response) => { 
        for (const match of response) { 
          let mt = {}
          if (match.users[0]._id != this.userId) {
            const img = await this.loadUserPhoto(match.users[0].images[0]); 
            mt = {
              matchId: match._id,
              name: match.users[0].name,
              id: match.users[0]._id,
              img: img,
              lastMsg: 'Hey, how are you?',
              lastMsgSender: '1'
            }
          }
          if (match.users[1]._id != this.userId) {
            const img = await this.loadUserPhoto(match.users[1].images[0]);
            mt = {
              matchId: match._id,
              name: match.users[1].name,
              id: match.users[1]._id,
              img: img,
              lastMsg: 'Hey, how are you?',
              lastMsgSender: '1'
            }
          }

          this.matches.push(mt);
        }

      },
      (error) => {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      }
    );
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
