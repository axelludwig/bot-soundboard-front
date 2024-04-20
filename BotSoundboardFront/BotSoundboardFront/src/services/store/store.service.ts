import { Injectable, OnInit, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';
import { Channel, queueItem, Base64File, Sound, Tag } from 'src/app/declarations';
import { SuccessSnackbar } from 'src/app/snackbars/success-snackbar/success-snackbar';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { SocketService } from 'src/services/socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService implements OnInit {
  public root: any = document.querySelector(':root');

  public currentChannel: Channel | null = null;
  public channels: Channel[] = [];
  public channelsLoaded: boolean = true;
  public queue: queueItem[] = [];

  public sounds: Sound[] = [];
  public filteredSounds: Sound[] = [];
  public displayedSounds: Sound[] = [];

  public soundsObservable: BehaviorSubject<Sound[]> = new BehaviorSubject<Sound[]>([]);
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
  public soundPlaying: Sound | null = null;
  public loaded: boolean = false;
  public primaryColor: string = "";
  public hideList = false;

  public uploadAfterUpload: boolean = false;

  public avoidDuplicates: boolean = false;

  // public soundsCopyForDuplicates: Sound[] = [];
  public randomlyPlayedIDs: number[] = [];


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
      this.updateFilteredSounds();
      this.sortSounds();
      // this.updatesSundsCopyForDuplicates();
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

    this.socketService.soundUpdated$.subscribe((sound: Sound) => {
      this.sounds.forEach((s) => {
        if (s.ID == sound.ID) {
          s.Name = sound.Name;
          s.Tags = sound.Tags;
        }
      });
      this.sortSounds();
      this.updateFilteredSounds();
      // this.updatesSundsCopyForDuplicates();
    });

    this.socketService.soundPlaying$.subscribe((sound: Sound) => {
      this.soundPlaying = sound;
    });
  }

  // updatesSundsCopyForDuplicates(): void {
  //   if (this.avoidDuplicates) this.soundsCopyForDuplicates = this.displayedSounds;
  // }

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

  applySearchFiler(): void {
    if (this.searchValue == "") {
      this.displayedSounds = this.filteredSounds;
      return;
    }

    this.displayedSounds = this.filteredSounds.filter((sound) => {
      var s = sound.Name.toLocaleLowerCase();
      var search = this.searchValue.toLocaleLowerCase();

      return s.includes(search);
    });
  }

  updateFilteredSounds(): void {
    this.filteredSounds = this.sounds;
    if (this.selectedTags.length == 0) {
      this.applySearchFiler();
      this.soundsObservable.next(this.displayedSounds);
      return;
    }
    let temp: Sound[] = [];
    this.sounds.forEach((sound: Sound) => {
      sound.Tags.forEach((tag: Tag) => {
        if (this.selectedTags.some((t) => t.ID === tag.ID) && !temp.some((s) => s.ID === sound.ID)) {
          temp.push(sound);
        }
      })
    });

    this.filteredSounds = temp;
    this.applySearchFiler();
    this.soundsObservable.next(this.displayedSounds);
  }

  ngOnInit() { }

  sortSounds(): void {
    this.filteredSounds.sort((a, b): number => {
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
      panelClass: ['sucess-snackbar'],
      data: { message: "Sound added to queue" }
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

  getPrimaryColor(): string {
    var rs = getComputedStyle(this.root);
    return rs.getPropertyValue('--primary')
  }

  getVariable(name: string): string {
    var rs = getComputedStyle(this.root);
    return rs.getPropertyValue(name);
  }

  myFunction_set() {
    this.root.style.setProperty('--primary', 'red');
  }

  shadeColor(color: string, percent: number) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = (R * (100 + percent) / 100);
    G = (G * (100 + percent) / 100);
    B = (B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    R = Math.round(R)
    G = Math.round(G)
    B = Math.round(B)

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
  }

  changeThemeColor(color: string) {
    this.root.style.setProperty('--primary', color);
    this.root.style.setProperty('--primary-variant', this.shadeColor(color, -40));
    this.root.style.setProperty('--text-color', this.getContrastYIQ(color));
    this.root.style.setProperty('--primary-complemantary', this.invertColor(color));
    this.root.style.setProperty('--primary-opacity', this.hexToRGB(color, '0.20'));

    localStorage.setItem("primaryColor", color);
  }

  getContrastYIQ(hexcolor: string) {
    var r = parseInt(hexcolor.substring(1, 3), 16);
    var g = parseInt(hexcolor.substring(3, 5), 16);
    var b = parseInt(hexcolor.substring(5, 7), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  invertColor(hex: string) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
      g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
      b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + this.padZero(r) + this.padZero(g) + this.padZero(b);
  }

  padZero(str: string, len?: number) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }

  hexToRGB(hex: string, alpha: string) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  toggleHideSoundsList() {
    this.hideList = !this.hideList;
  }

  // apply() {
  //   let element = <HTMLElement>document.querySelector(':root');
  //   element.style.setProperty('--primary', this.variable);
  // }
}
