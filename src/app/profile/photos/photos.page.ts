import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { PhotoService } from '../../services/photo.service';
import { UserService } from '../../services/user.service';
import { AuthService } from 'src/app/services/auth.service';

/**
 * Interface for representing a photo with ID and URL for upload.
 */
interface PhotoUpld {
  id: string;
  url: string;
}

/**
 * Component for the photos page.
 * It includes functionality for displaying, uploading, and deleting photos,
 * as well as selecting photos from the camera or gallery.
 */
@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {
  /**
   * Array of photo IDs associated with the user.
   */
  photosIds: any[] = [];

  /**
   * Array of photos associated with the user.
   */
  photos: PhotoUpld[] = [];

  /**
   * Constructor initializes the component with necessary service dependencies.
   * @param {ActionSheetController} actionSheet - Ionic controller for handling action sheets.
   * @param {PhotoService} photoService - Service for photo-related functionalities.
   * @param {UserService} userService - Service for user-related functionalities.
   * @param {AuthService} authService - Service for authentication-related functionalities.
   */
  constructor(private actionSheet: ActionSheetController,
    public photoService: PhotoService,
    private userService: UserService,
    private authService: AuthService) { }

  /**
   * OnInit lifecycle hook to load user photos after component initialization.
   */
  ngOnInit() {
    this.loadUserPhotos();
  }

  /**
   * Fetches and sets the user's photos data.
   */
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

  /**
   * Loads photo data by photo ID and adds it to the photos array.
   * @param {string} id - The ID of the photo to load.
   */
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

  /**
   * Handles new photo upload from input file change event.
   * @param {any} event - The input file change event.
   */
  newPhoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoService.uploadPhoto(file).subscribe(
        (response) => {
          this.loadUserPhotos();
        },
        (error) => {
          console.error('Erreur lors de l\'upload de la photo:', error);
        }
      );
    }
  }

  /**
   * Deletes a photo by ID.
   * @param {string} id - The ID of the photo to delete.
   */
  deletePhoto(id: string): void {
    this.photoService.deletePhoto(id).subscribe(
      (response) => {
        this.loadUserPhotos();
      },
      (error) => {
        console.error('Erreur lors de la suppression de la photo:', error);
      }
    );
  }

  /**
   * Presents options for selecting an image from the camera or gallery.
   */
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

  /**
   * Uploads a photo taken from the camera or selected from the gallery.
   * @param {any} photo - The photo object to upload.
   */
  private uploadPhotoFromCamera(photo: any) {
    this.photoService.uploadPhotoFromCamera(photo).then(observable => {
      observable.subscribe(
        (response) => {
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

}
