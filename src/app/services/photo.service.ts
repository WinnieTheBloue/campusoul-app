// photo.service.ts
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl: string; 

  constructor(private http: HttpClient, private authService: AuthService, private apiService: ApiService) { 
    this.apiUrl = apiService.getApiUrl();
  }

  async takeFromCamera() {

    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    return capturedPhoto;
  }

  uploadPhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.post(`${this.apiUrl}/images`, formData, { headers });
  }

  getPhoto(id: string): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/images/${id}`, { headers });
  }

  deletePhoto(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.delete(`${this.apiUrl}/images/${id}`, { headers, responseType: 'text' });
  }

  async selectImageFromGallery(): Promise<Photo> {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos, 
      quality: 100
    });

    return image;
  }

  async uploadPhotoFromCamera(photo: Photo): Promise<Observable<any>> {
    if (!photo.webPath) {
      throw new Error('No photo path available');
    }
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
    return this.uploadPhoto(file);
  }
  
}
