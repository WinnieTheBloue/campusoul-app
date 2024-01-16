import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user: any = {
    name: "John Doe",
    birthdate: "1990-02-19",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam id rhoncus luctus, nisl nunc aliquam nunc, vitae aliquam eros nisl eu velit. ",
    imgs: [
      { id: "1", url: "https://cache.cosmopolitan.fr/data/photo/w1000_c17/42/nicklas_pedersen_mister_world.jpg" },
      { id: "2", url: "https://passimale.fr/wp-content/uploads/2022/05/beau-gosse-barbe.jpg" },
      { id: "3", url: "https://www.boutik.jock.life/wp-content/uploads/2021/05/mug-beau-gosse-chien.jpg" },
      { id: "4", url: "https://cache.cosmopolitan.fr/data/photo/w1000_c17/42/nicklas_pedersen_mister_world.jpg" },
      { id: "5", url: "https://passimale.fr/wp-content/uploads/2022/05/beau-gosse-barbe.jpg" },
      { id: "6", url: "https://www.boutik.jock.life/wp-content/uploads/2021/05/mug-beau-gosse-chien.jpg" }
    ],
    interests: [
      { id: "1", name: "Sport" },
      { id: "2", name: "Cinema" },
      { id: "3", name: "Music" }
    ],
    
  }
  constructor() { }

  ngOnInit() {
  }

}
