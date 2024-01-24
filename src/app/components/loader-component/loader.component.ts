import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';

interface Photo {
  id: string;
  url: string;
}

@Component({
  selector: 'app-loader-component',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class LoaderComponent implements OnInit {
  constructor() {}

  ngOnInit() {
  }

  
}
