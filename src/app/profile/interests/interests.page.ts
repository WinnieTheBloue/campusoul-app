import { Component, OnInit } from '@angular/core';
interface Interest {
  id: string;
  name: string;
}

@Component({
  selector: 'app-interests',
  templateUrl: './interests.page.html',
  styleUrls: ['./interests.page.scss'],
})
export class InterestsPage implements OnInit {
  interests: Interest[] = [
    {id:"1", name:"Ski"},
    {id:"2", name:"Snowboard"},
    {id:"3", name:"Hiking"},
    {id:"4", name:"Camping"},
    {id:"5", name:"Biking"},
    {id:"6", name:"Kayaking"},
    {id:"7", name:"Running"},
    {id:"8", name:"Swimming"},
    {id:"9", name:"Tennis"},
  ]
  selectedInterests: Interest[] = [{id:"1", name:"Ski"}, {id:"5", name:"Biking"}]
  selectedSum?: number = 2
  constructor() { }

  ngOnInit() {
  }

  isSelected(interest: Interest): boolean {
    return this.selectedInterests.some(selectedInterest => selectedInterest.id === interest.id);
  }
}
