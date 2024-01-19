// photos.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoService } from '../../../services/photo.service';
import { UserService } from '../../../services/user.service';

interface Photo {
  id: string;
  url: string;
}


@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {
  photosIds: any[] = [];
  photos: Photo[] = [];
  constructor(private photoService: PhotoService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.loadUserPhotos();
  }

  
  loadUserPhotos(): void {
    this.photosIds = []
    this.photos = []
    this.userService.getUserProfile().subscribe(
      (response) => {
        this.photosIds = response.user.images;
        this.photosIds.forEach(photo => {
          this.loadPhotoData(photo);
        });
      },
      (error) => {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      }
    );
  }
  
  loadPhotoData(id: string): void {
    this.photoService.getPhoto(id).subscribe(
      (response) => {
        const photo: Photo = {
          id: id,
          url: response.url // Assurez-vous que response contient l'URL de la photo.
        };
        this.photos.push(photo);
      },
      (error) => {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      }
    );
  }

  newPhoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoService.uploadPhoto(file).subscribe(
        (response) => {
          console.log('Photo uploadée avec succès:', response);
          this.loadUserPhotos();
        },
        (error) => {
          console.error('Erreur lors de l\'upload de la photo:', error);
        }
      );
    }
  }

  deletePhoto(id: string): void {
    this.photoService.deletePhoto(id).subscribe(
      (response) => {
        console.log('Photo supprimée avec succès:', response); // response sera une chaîne de caractères
        this.loadUserPhotos(); // Recharger les photos pour mettre à jour l'affichage
      },
      (error) => {
        console.error('Erreur lors de la suppression de la photo:', error);
      }
    );
  }

  submitPhotos(): void {
    this.router.navigate(['/']);
  }
}
