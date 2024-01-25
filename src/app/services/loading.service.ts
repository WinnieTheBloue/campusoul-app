import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

/**
 * Injectable service to manage the presentation of loading indicators.
 * This service manages the display of a loading screen across the app, ensuring that it's presented
 * when there are active loading requests and dismissed when there are none.
 */
@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    /**
     * The loading element reference.
     */
    private loadingElement: HTMLIonLoadingElement | null = null;

    /**
     * Counter to track the number of active loading requests.
     */
    private activeRequests = 0;

    /**
     * Flag to indicate if the loading indicator is currently shown.
     */
    private isLoadingShown = false;

    /**
     * Constructor initializes the service with necessary dependencies.
     * @param {LoadingController} loadingController - Ionic controller for handling loading indicators.
     */
    constructor(public loadingController: LoadingController) { }

    /**
     * Shows the loading indicator. If there are multiple requests to show loading,
     * it ensures that the loading indicator is only presented once.
     */
    async showLoading() {
        this.activeRequests++;

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

    /**
     * Hides the loading indicator. It ensures that the loading indicator is dismissed
     * only when there are no more active loading requests.
     */
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