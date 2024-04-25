import { Component, HostListener, SimpleChanges } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';
import { Sound } from '../declarations';
import { StoreService } from 'src/services/store/store.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsModalComponent } from '../modals/settings-modal/settings-modal.component';

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


  constructor(private socketService: SocketService, public store: StoreService, public dialog: MatDialog) {
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

  openSettings(event: Event) {
    event.stopPropagation()
    let dialog = this.dialog.open(SettingsModalComponent, {
      disableClose: false,
      width: '400px',
    });

    dialog.afterClosed().subscribe(result => {
      if (result === undefined || result === null || result === '') return;
    });
  }

  playRandom(event: any) {
    let sounds: Sound[];
    let count = 1;
    if (event.shiftKey) {
      count = 10;
    } else {
      // do that
    }
    // console.log(this.store.soundsCopyForDuplicates.length === 0);

    // if (this.store.avoidDuplicates) {
    //   if (this.store.soundsCopyForDuplicates.length === 0)
    //     this.store.soundsCopyForDuplicates = this.store.displayedSounds;
    //   sounds = this.store.soundsCopyForDuplicates;
    // } else {
    //   sounds = this.store.displayedSounds;
    // }

    sounds = this.store.displayedSounds;

    // console.log(this.store.displayedSounds);

    while (count > 0) {
      if (this.store.avoidDuplicates) {
        sounds = this.store.displayedSounds.filter(sound => {
          return !this.store.randomlyPlayedIDs.includes(sound.ID);
        });
        if (sounds.length === 0) {
          sounds = this.store.displayedSounds;
          this.store.randomlyPlayedIDs = [];
        }
      }
      // console.log(this.store.randomlyPlayedIDs);


      let random = Math.floor(Math.random() * sounds.length);
      let randomSoundID = sounds[random].ID;

      // console.log(randomSoundID);
      this.socketService.playSound(randomSoundID);


      if (this.store.avoidDuplicates) {
        this.store.randomlyPlayedIDs.push(randomSoundID);
      }

      count--;
    }
  }

  isEllipsisActive(e: any) {
    return false;
    // return (e.offsetWidth < e.scrollWidth);
  }
}
