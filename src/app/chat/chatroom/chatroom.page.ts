import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.page.html',
  styleUrls: ['./chatroom.page.scss'],
})
export class ChatroomPage implements OnInit {
  match: any = {
    name: 'Megan Fox',
    id: '1',
    img: 'https://hips.hearstapps.com/hmg-prod/images/gettyimages-843456920.jpg',
  }
  message?: string;
  matchid?: any
  messages: any[] = []
  userId: any = '';

  constructor(private route: ActivatedRoute, private messagesService: MessagesService, private authService: AuthService) { }

  ngOnInit() {
    this.userId = this.authService.getId();
    this.route.params.subscribe(params => {
      this.matchid = params['id']; 
    });

    this.loadMessages()
  }

  loadMessages() {
    this.messagesService.getMessages(this.matchid).subscribe(
      (response) => {
        console.log(response);
        this.messages = response;
      },
      (error) => {
        console.error('Erreur lors du chargement des messages:', error);
      }
    );
  }

  sendMessage() {
    const body = {
      matchId : this.matchid,
      content: this.message
    }
    this.messagesService.sendMessage(body).subscribe(
      (response) => {
        this.loadMessages();
      },
      (error) => {
        console.error('Erreur lors de l\'envoi du message:', error);
      }
    );
  }
}
