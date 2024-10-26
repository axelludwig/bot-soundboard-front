import { Injectable, OnInit, SimpleChanges } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor() {
    }

    isTimeVisible(soundTime: number): string {
        return soundTime === 0 ? 'hidden' : 'visible';
    }

    getFormattedTime(moreThanAnHour: boolean): string {
        return moreThanAnHour ? 'hh:mm:ss' : 'mm:ss';
    }

    isMoreThanAnHour(seconds: number): boolean {
        const secondsInAnHour = 3600000;
        return seconds > secondsInAnHour;
      }
}
