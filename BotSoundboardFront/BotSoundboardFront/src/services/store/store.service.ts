import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Channel, queueItem, Base64File, Sound, Tag } from 'src/app/declarations';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { SocketService } from 'src/services/socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService implements OnInit {

  public currentChannel: Channel | null = null;
  public channels: Channel[] = [];
  public channelsLoaded: boolean = true;
  public queue: queueItem[] = [];

  public sounds: Sound[] = [];
  public soundsCopy: Sound[] = [];
  // public filteredSounds: Sound[] = [];  
  public selectedTags: string[] = [];

  public searchValue: string = "";

  private _updateBase64File = new Subject<Base64File>();
  updateBase64File$ = this._updateBase64File.asObservable();
  private _newSoundName = new Subject<string>();
  newSoundName$ = this._newSoundName.asObservable();

  private _soundName = new Subject<string>();
  soundName$ = this._soundName.asObservable();

  public newSound: string | null = null;

  constructor(private socketService: SocketService) {
    socketService.queueUpdate$.subscribe((queue: queueItem[]) => {
      this.queue = queue;
    })

    this.socketService.botChangeChannel$.subscribe((id: string) => {
      this.currentChannel = this.getChannelById(id);
    })

    this.socketService.channels$.subscribe((channels: Channel[]) => {
      this.channels = channels;
      this.channelsLoaded = true;
    })

    this.socketService.sounds$.subscribe((sounds: Sound[]) => {
      this.sounds = sounds;
      this.soundsCopy = sounds;
      this.sortSounds();
      // this.filteredSounds = sounds;
      this.updateFilteredSounds();

    })
  }

  applyTestFiler(): void {
    this.sounds = this.sounds.filter((sound) => {
      var s = sound.Name.toLocaleLowerCase();
      var search = this.searchValue.toLocaleLowerCase()
      return s.includes(search);
    });
  }

  updateFilteredSounds(): void {
    this.sounds = this.soundsCopy;
    this.applyTestFiler();
    if (this.selectedTags.length == 0) {
      return;
    }
    let temp: Sound[] = [];
    this.sounds.forEach((sound: Sound) => {
      sound.Tags.forEach((tag: Tag) => {
        if (this.selectedTags.includes(tag.Name)) temp.push(sound);
      })
    })
    this.sounds = temp;
  }

  ngOnInit() {
  }

  sortSounds(): void {
    this.sounds.sort((a, b): number => {
      if (a.Name.toLowerCase() < b.Name.toLowerCase()) return -1;
      else if (a > b) return 1;
      else return 0
    })
  }

  getChannelById(id: string): Channel | null {
    for (let index = 0; index < this.channels.length; index++) {
      const element = this.channels[index];
      if (element.id === id) return element;
    } return null;
  }

  updateBase64File(base64: Base64File): void {
    this._updateBase64File.next(base64);
  }

  updateNewSoundName(name: string): void {
    this._newSoundName.next(name);
  }

  updateSoundName(name: string): void {
    this._soundName.next(name);
  }
}
