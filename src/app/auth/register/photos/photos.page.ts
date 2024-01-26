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

/**
 * Component for managing user photos.
 * Handles functionalities for loading, displaying, uploading, and deleting photos,
 * as well as capturing new photos from the camera or selecting from the gallery.
 */
@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {
  /** Array of photo IDs associated with the user. */
  photosIds: any[] = [];

  /** Array of photos to be displayed. */
  photos: PhotoUpld[] = [];

  /** Message to display in case of an error or validation message. */
  errorMessage: string = '';

  /**
   * Initializes the component with necessary services.
   * @param actionSheet Service for presenting a sheet of options.
   * @param photoService Service for photo management.
   * @param userService Service for user data management.
   * @param router Router for navigation.
   * @param authService Service for authentication processes.
   */
  constructor(
    private actionSheet: ActionSheetController,
    public photoService: PhotoService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) { }

  /** Loads user photos when the component is initialized. */
  ngOnInit() {
    this.loadUserPhotos();
  }

  /**
   * Loads the photos associated with the user.
   * Fetches photo IDs from the user profile and then loads each photo's data.
   */
  loadUserPhotos(): void {
    this.photosIds = [];
    this.photos = [];
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
   * Loads data for a specific photo by its ID.
   * @param id The ID of the photo to load.
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
   * Handles the process of uploading a new photo.
   * @param event Event containing the photo file to upload.
   */
  newPhoto(event: any): void {
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
   * Deletes a photo by its ID.
   * @param id The ID of the photo to delete.
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
   * Presents options for selecting a new image either from the gallery or by using the camera.
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
   * Uploads a photo taken from the camera.
   * @param photo The photo taken from the camera.
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

  /**
   * Submits the photos.
   * Validates the number of photos before proceeding.
   */
  submitPhotos(): void {
    if (this.photos.length > 0) {
      localStorage.setItem('photosIsValid', "true");
      this.router.navigate(['/']);
    } else if (this.photos.length > 10) {
      this.errorMessage = 'Vous ne pouvez pas ajouter plus de 10 photos';
    } else {
      this.errorMessage = 'Veuillez ajouter au moins une photo';
    }
  }
}
