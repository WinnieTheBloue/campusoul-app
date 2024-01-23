// photos.page.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { PhotoService } from '../../../services/photo.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from 'src/app/services/auth.service';
interface PhotoUpld {
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
  photos: PhotoUpld[] = [];
  constructor(private actionSheet: ActionSheetController, public photoService: PhotoService, private userService: UserService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.loadUserPhotos();
  }


  loadUserPhotos(): void {
    this.photosIds = []
    this.photos = []
    this.userService.getUserProfile(this.authService.getId()).subscribe(
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
        const photo: PhotoUpld = {
          id: id,
          url: response.url
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
        console.log('Photo supprimée avec succès:', response); 
        this.loadUserPhotos(); 
      },
      (error) => {
        console.error('Erreur lors de la suppression de la photo:', error);
      }
    );
  }

  async selectimageOptions() {
    const actionSheet = await this.actionSheet.create({
      header: 'Selectionner un image',
      buttons: [
        {
          text: 'Charger depuis la galerie',
          handler: async () => {
            try {
              const photo = await this.photoService.selectImageFromGallery();
              if (photo) {
                this.uploadPhotoFromCamera(photo);
              }
            } catch (error) {
              console.error('Gallery error:', error);
            }
            console.log('Image Selected from Gallery');
          }
        },
        {
          text: 'Utiliser la caméra',
          handler: async () => {
            try {
              const photo = await this.photoService.takeFromCamera();
              if (photo) {
                this.uploadPhotoFromCamera(photo);
              }
            } catch (error) {
              console.error('Camera error:', error);
            }
            console.log('Camera Selected');
          }
        },
        {
          text: 'Annuler',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  private uploadPhotoFromCamera(photo: any) {
    this.photoService.uploadPhotoFromCamera(photo).then(observable => {
      observable.subscribe(
        (response) => {
          console.log('Photo uploaded successfully:', response);
          this.loadUserPhotos();
        },
        (error) => {
          console.error('Error uploading photo:', error);
        }
      );
    }).catch(error => {
      console.error('Error in photo upload process:', error);
    });
  }

  submitPhotos(): void {
    this.router.navigate(['/']);
  }
}
