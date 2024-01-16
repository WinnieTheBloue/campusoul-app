import { Component, OnInit } from '@angular/core';
interface Photos {
  id: string;
  url: string;
}
@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {
  photos: Photos[] = [
    {id:"1", url:"https://cache.cosmopolitan.fr/data/photo/w1000_c17/42/nicklas_pedersen_mister_world.jpg"},
    {id:"2", url:"https://passimale.fr/wp-content/uploads/2022/05/beau-gosse-barbe.jpg"},
    {id: "2", url: "https://www.boutik.jock.life/wp-content/uploads/2021/05/mug-beau-gosse-chien.jpg"}
  ]
  constructor() { }

  ngOnInit() {
  }

}
