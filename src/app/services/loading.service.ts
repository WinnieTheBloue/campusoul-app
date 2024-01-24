import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loadingElement: HTMLIonLoadingElement | null = null;
    private activeRequests = 0;
    private isLoadingShown = false;

    constructor(public loadingController: LoadingController) {}

    async showLoading() {
        this.activeRequests++;
        console.log("showLoading " + this.activeRequests);

        if (!this.loadingElement && !this.isLoadingShown) {
            this.isLoadingShown = true;
            this.loadingElement = await this.loadingController.create({
                cssClass: 'custom-loading',
            });
            const minDisplayTime = 1000; 
            setTimeout(async () => {
                if (this.loadingElement && this.activeRequests > 0) {
                    await this.loadingElement.present();
                }
            }, minDisplayTime);
        }
    }

    async hideLoading() {
        if (this.activeRequests > 0) {
            this.activeRequests--;
        } else {
            console.error("hideLoading was called without a matching showLoading.");
        }

        if (this.activeRequests === 0 && this.loadingElement) {
            await this.loadingElement.dismiss();
            this.loadingElement = null;
            this.isLoadingShown = false;
        }
    }
}



