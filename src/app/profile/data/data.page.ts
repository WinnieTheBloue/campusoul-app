import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss'],
})
export class DataPage implements OnInit {
  profile: any = {
    name: 'John Doe',
    birthdate: '1990-02-17',
    email: 'john@doe.ch',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel libero at lectus rutrum vestibulum vitae ut turpis. Ut ultricies pulvinar posuere. Nulla rutrum, libero nec pharetra accumsan, enim leo blandit dui, ac bibendum augue dui sed justo.',
  }
  constructor() { }

  ngOnInit() {
  }

}
