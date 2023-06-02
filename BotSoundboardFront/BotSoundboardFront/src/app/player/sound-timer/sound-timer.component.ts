import { Component } from '@angular/core';
import { Sound } from 'src/app/declarations';
import { SocketService } from 'src/services/socket/socket.service';

@Component({
  selector: 'app-sound-timer',
  templateUrl: './sound-timer.component.html',
  styleUrls: ['./sound-timer.component.css']
})
export class SoundTimerComponent {
  private intervalValue: number = 50;
  private isPaused: boolean = false;
  private isPlayingSound: boolean = false;

  elapsedTime: number = 0;
  soundTime: number = 0;
  progress: number = 0;

  constructor(private socket: SocketService) {
    this.socket.elapsedTime$.subscribe((time: number) => {
      this.elapsedTime = time;
      this.setProgress();
    });

    this.socket.botChangePauseState$.subscribe((isPaused: boolean) => {
      this.isPaused = isPaused;
    });

    this.socket.soundPlaying$.subscribe((sound: Sound) => {
      if (!sound){
        this.isPlayingSound = false;
      }
      else{
        this.isPlayingSound = true;
      }
    });

    this.socket.soundPlaying$.subscribe((sound: Sound) => {
      if (sound){
        this.soundTime = sound.SoundLength;
        this.setProgress();
      }
    });
  }

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer() {
    setInterval(() => {
      if (this.isPaused || !this.isPlayingSound) {
        return;
      }

      this.elapsedTime += this.intervalValue;
      this.setProgress();
    }, this.intervalValue);
  }

  progressChanged(event: any){
    let value: number = Number((event.target as HTMLInputElement).value);
    this.progress = value;
    this.socket.setAudioTime(value);
  }

  private setProgress(){
    this.progress = this.elapsedTime / this.soundTime;
  }
}
