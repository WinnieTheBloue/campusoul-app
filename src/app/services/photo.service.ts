import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

/**
 * Injectable service to handle photo-related operations.
 * This service includes taking photos from the camera, selecting images from the gallery,
 * uploading photos to the server, retrieving specific photos, and deleting photos.
 */
@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  /**
   * The base URL of the API.
   */
  private apiUrl: string;

  /**
   * Constructor initializes the service with necessary dependencies.
   * @param {HttpClient} http - The Angular HTTP client for making HTTP requests.
   * @param {AuthService} authService - Service for authentication-related functionalities.
   * @param {ApiService} apiService - Service for API-related functionalities.
   */
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private apiService: ApiService,
  ) {
    this.apiUrl = this.apiService.getApiUrl();
  }

  /**
   * Takes a photo using the device's camera.
   * @returns {Promise<Photo>} A promise that resolves with the captured photo.
   */
  async takeFromCamera(): Promise<Photo> {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    return capturedPhoto;
  }

  /**
   * Uploads a photo to the server.
   * @param {File} file - The photo file to be uploaded.
   * @returns {Observable<any>} The observable of the HTTP post request.
   */
  uploadPhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.post(`${this.apiUrl}/images`, formData, { headers });
  }

  /**
   * Retrieves a specific photo by ID.
   * @param {string} id - The ID of the photo to retrieve.
   * @returns {Observable<any>} The observable of the HTTP get request.
   */
  getPhoto(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/images/${id}`, { headers });
  }

  /**
   * Deletes a specific photo by ID.
   * @param {string} id - The ID of the photo to delete.
   * @returns {Observable<any>} The observable of the HTTP delete request.
   */
  deletePhoto(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.delete(`${this.apiUrl}/images/${id}`, { headers, responseType: 'text' });
  }

  /**
   * Selects an image from the device's gallery.
   * @returns {Promise<Photo>} A promise that resolves with the selected image.
   */
  async selectImageFromGallery(): Promise<Photo> {
    const selectedImage = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 100
    });

    return selectedImage;
  }

  /**
   * Uploads a photo taken from the camera to the server.
   * @param {Photo} photo - The photo object to upload.
   * @returns {Promise<Observable<any>>} A promise that resolves with the observable of the HTTP post request.
   */
  async uploadPhotoFromCamera(photo: Photo): Promise<Observable<any>> {
    const photoPath = photo.path || photo.webPath || photo;

    if (!photoPath) {
      throw new Error('No photo path available');
    }

    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
    return this.uploadPhoto(file);
  }
}