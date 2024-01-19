import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { IonIcon } from '@ionic/angular/standalone';
import { IonChip } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile-component',
  templateUrl: './profile-component.component.html',
  styleUrls: ['./profile-component.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonChip]
})
export class ProfileComponentComponent  implements OnInit {
  @Input() user: any
  @Input() isDiscover: boolean = false
  imgIndex: number = 2
  constructor() { }

  ngOnInit() {}

  getAge(birthdateStr: string): number {
    const birthdate = new Date(birthdateStr);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    return age;
  }
}