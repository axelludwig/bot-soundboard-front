import { Injectable, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { Channel, queueItem, Base64File, Sound, Tag } from 'src/app/declarations';
import { SuccessSnackbar } from 'src/app/snackbars/success-snackbar/success-snackbar';
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
  public selectedTags: Tag[] = [];
  public selectedTagsIds: number[] = [];
  public favoriteTags: Tag[] = [];
  public favoriteTagsIds: number[] = [];

  public searchValue: string = "";

  private _updateBase64File = new Subject<Base64File>();
  updateBase64File$ = this._updateBase64File.asObservable();
  private _newSoundName = new Subject<string>();
  newSoundName$ = this._newSoundName.asObservable();

  private _soundName = new Subject<string>();
  soundName$ = this._soundName.asObservable();

  public newSound: string | null = null;

  public successSnackbar: any;

  public tags: Tag[] = [];

  constructor(private socketService: SocketService, private _snackBar: MatSnackBar) {
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

    this.socketService.newTag$.subscribe((tag: Tag) => {
      // this.renameLocalStorageTags()
      this.tags.forEach((t) => {
        if (t.ID == tag.ID) {
          t.Name = tag.Name;
        }
      })
      this.sortTags(this.tags);
      this.renameLocalStorageTags(tag, tag.Name);
    })
  }

  sortArray(array: Tag[]) {
    return array.sort((a, b) => {
      if (a.Name.toLowerCase() < b.Name.toLowerCase()) return -1;
      else if (a.Name.toLowerCase() > b.Name.toLowerCase()) return 1;
      else return 0;
    });
  }

  sortTags(tags: Tag[]) {
    let selectedTagsList: Tag[] = [];
    let favoritesTagsList: Tag[] = [];
    let unselectedTagsList: Tag[] = [];

    for (let tag of tags) {
      if (this.selectedTagsIds.includes(tag.ID)) selectedTagsList.push(tag);
      else if (this.favoriteTagsIds.includes(tag.ID)) favoritesTagsList.push(tag);
      else unselectedTagsList.push(tag);
    }
    this.tags = this.sortArray(selectedTagsList).concat(this.sortArray(favoritesTagsList)).concat(this.sortArray(unselectedTagsList));
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
        if (this.selectedTags.includes(tag)) temp.push(sound);
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

  openSucessSnackBar() {
    this.successSnackbar = this._snackBar.openFromComponent(SuccessSnackbar, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['sucess-snackbar']
    });
  }

  renameLocalStorageTags(pTag: Tag, newName: string) {
    let selectedTags = JSON.parse(localStorage.getItem('selectedTags') || "[]");
    let favoriteTags = JSON.parse(localStorage.getItem('favoriteTags') || "[]");

    selectedTags.forEach((tag: Tag) => {
      if (pTag.ID == tag.ID) tag.Name = newName;
    })

    favoriteTags.forEach((tag: Tag) => {
      if (pTag.ID == tag.ID) tag.Name = newName;
    })

    localStorage.setItem('selectedTags', JSON.stringify(selectedTags));
    localStorage.setItem('favoriteTags', JSON.stringify(favoriteTags));
  }
}
