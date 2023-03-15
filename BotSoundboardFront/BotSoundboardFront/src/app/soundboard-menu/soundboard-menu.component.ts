import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from 'src/services/socket/socket.service';

@Component({
  selector: 'app-soundboard-menu',
  templateUrl: './soundboard-menu.component.html',
  styleUrls: ['./soundboard-menu.component.css']
})
export class SoundboardMenuComponent {
  @Input() newSound: string | null = null;

  private axiosService: AxiosService;
  private socketService: SocketService;

  sounds: string[] = [];
  soundsCopy: string[] = [];
  public searchValue: string = "";

  ngOnChanges(changes: SimpleChanges): void {
    if (this.newSound !== "" && this.newSound !== null && changes['newSound']) {
      this.sounds.push(changes['newSound'].currentValue);
      this.soundsCopy.push(changes['newSound'].currentValue);
    }
  }

  constructor(socketService: SocketService, axiosService: AxiosService) {
    this.axiosService = axiosService;
    this.socketService = socketService;
    this.getSounds();
  }

  getSounds() {
    var options: GetOptions = {
      url: "/sounds"
    }
    this.axiosService.get(options)
      .then((res: any) => {
        this.sounds = res;
        this.soundsCopy = res;
      })
      .catch((err) => {
        console.log(err);
      })
  }

  soundClicked(sound: string) {
    this.socketService.playSound(sound);
  }

  textChange() {  
    this.sounds = this.soundsCopy;
    this.sounds = this.sounds.filter((sound) => {
      var s = sound.toLocaleLowerCase();
      var search = this.searchValue.toLocaleLowerCase()
      return s.includes(search);
    })
  }

  clearText() {
    this.searchValue = "";
    this.sounds = this.soundsCopy;
  }
}