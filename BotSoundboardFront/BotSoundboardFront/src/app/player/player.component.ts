import { Component, HostListener } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';

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

  constructor(private socketService: SocketService) {
    this.socketService.botChangePauseState$.subscribe((state: boolean) => {
      this.isPaused = state;
    });
  }

  skipSound() {
    this.socketService.skipSound();
  }

  togglePause() {
    this.socketService.botChangePauseState(this.isPaused);
  }
}
