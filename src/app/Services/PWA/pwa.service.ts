import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
    providedIn: 'root'
})
export class PWAService {

    promptEvent: any;

    constructor(private swUpdate: SwUpdate) {
        window.addEventListener('beforeinstallprompt', event => {
            this.promptEvent = event;
        });
    }

    askUserToUpdate() {
        this.swUpdate.available.subscribe(event => {
            if (confirm('Update available. Load new version?')) {
                window.location.reload();
            }
        });
    }
}
