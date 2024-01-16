import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  matches: any[] = [ 
    {
      name: 'Megan Fox',
      id: '1',
      img: 'https://hips.hearstapps.com/hmg-prod/images/gettyimages-843456920.jpg',
      lastMsg: 'Hey, how are you?',
      lastMsgSender: '1'
    },
    {
      name: 'Ice Spice',
      id: '2',
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Ice_Spice_Next_Wav_by_Keinoflo_uploaded_by_James_Tamim_V4_%28cropped_V2%29_2022.png/640px-Ice_Spice_Next_Wav_by_Keinoflo_uploaded_by_James_Tamim_V4_%28cropped_V2%29_2022.png',
      lastMsg: 'Hey, how are you?',
      lastMsgSender: '9'
    }
  ]
  constructor() { }

  ngOnInit() {
  }

}
