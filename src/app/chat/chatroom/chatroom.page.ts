import { Component, OnInit } from '@angular/core';

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
  userId: string = '9';
  messages: any[] = [
    {
      sender: '1',
      msg: 'Hey, how are you?'
    },
    {
      sender: '9',
      msg: 'I\'m fine, thanks. And you?'
    },
    {
      sender: '1',
      msg: 'I\'m fine too, thanks for asking.'
    },
    {
      sender: '9',
      msg: 'So, what are you doing tonight?'
    },
    {
      sender: '1',
      msg: 'Nothing much, just watching TV. You?'
    },
    {
      sender: '9',
      msg: 'I\'m going to the movies with some friends.'
    },
    {
      sender: '9',
      msg: 'Do you want to come?'
    },
    {
      sender: '1',
      msg: 'Sure, why not?'
    },
    {
      sender: '9',
      msg: 'Great! I\'ll pick you up at 8.'
    },
    {
      sender: '1',
      msg: 'See you later.'
    },
    {
      sender: '9',
      msg: 'Bye.'
    }

  ]
  constructor() { }

  ngOnInit() {
  }

  sendMessage() {
    console.log(this.message);
  }
}
