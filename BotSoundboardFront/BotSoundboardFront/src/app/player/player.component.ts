import { Component, HostListener } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';
import { Sound } from '../declarations';
import { StoreService } from 'src/services/store/store.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: any) {
    if (event.code === 'MediaPlayPause') this.togglePause();
    else if (event.code === 'MediaTrackNext') this.skipSound();
  }  
  
  public isPaused = true;
  public volume: number = 0;

  constructor(private socketService: SocketService, public store: StoreService) {
    this.socketService.botChangePauseState$.subscribe((state: boolean) => {
      this.isPaused = state;
    });

    this.socketService.soundPlaying$.subscribe((sound: Sound) => {
      this.store.soundPlaying = sound;
    });

    this.socketService.botChangeVolume$.subscribe((value: number) => {
      this.volume = value;
    });
  }

  skipSound() {
    this.socketService.skipSound();
  }

  togglePause() {
    this.socketService.botChangePauseState(this.isPaused);
  }

  onSliderChange(event: any) {
    this.socketService.setVolume(event.value)
  }
}
