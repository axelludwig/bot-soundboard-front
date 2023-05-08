import { Component, Input, SimpleChanges, OnChanges, Inject } from '@angular/core';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from 'src/services/socket/socket.service';
import { StoreService } from 'src/services/store/store.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { RenameModalComponent } from '../rename-modal/rename-modal.component';

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
  searchValue: string = "";
  editMode = false;
  showHidden = false;

  hiddenSounds: string[] = []

  ngOnChanges(changes: SimpleChanges): void {
    if (this.newSound !== "" && this.newSound !== null && changes['newSound']) {
      this.sounds.push(changes['newSound'].currentValue);
      this.sortSounds();
    }
  }

  constructor(socketService: SocketService, axiosService: AxiosService, public store: StoreService, public dialog: MatDialog) {
    this.axiosService = axiosService;
    this.socketService = socketService;
    this.getSounds();

    this.socketService.deleteSound$.subscribe((sound: string) => {
      this.sounds = this.sounds.filter((s) => {
        return s !== sound
      })
    })
  }

  getSounds() {
    var options: GetOptions = {
      url: "/sounds"
    }
    this.axiosService.get(options)
      .then((res: any) => {
        this.sounds = res;
        this.soundsCopy = res;
        this.sortSounds();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  soundClicked(event: any, sound: string) {
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

  rename(event: any, sound: string) {
    event.stopPropagation()
    console.log('rename');
  }

  delete(event: any, sound: string) {
    event.stopPropagation()
    this.socketService.deleteSound(sound)
  }

  hide(event: any, sound: string) {
    // event.stopPropagation()
    // let hiddenSounds: string[] = [];
    // let localStorageSounds = localStorage.getItem("hiddenSounds");
    // if (localStorageSounds) {
    //   if (!localStorageSounds?.includes)
    // } 
  }

  openDialog(event: Event, oldName: string) {
    event.stopPropagation()
    let dialog = this.dialog.open(RenameModalComponent, {
      data: oldName,
    });

    dialog.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      console.log("Your Name: " + result);

      var options: GetOptions = { url: "/sound" }
      options.params = {
        oldName: oldName,
        newName: result
      };
      
      this.axiosService.put(options).then((res) => {
          console.log(res);
      })
        .catch((err) => {
          console.log(err);
        })
    });
  }

  stringToArray(str: string): string[] {
    return str.split('|');
  }

  arrayToString(array: string[]): string {
    if (!array) return '';
    return array.join('|')
  }

  sortSounds(): void {
    this.sounds.sort((a, b): number => {
      if (a < b) return -1;
      else if (a > b) return 1;
      else return 0
    })
  }
}