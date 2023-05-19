import { Component, Input, SimpleChanges, OnChanges, Inject } from '@angular/core';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from 'src/services/socket/socket.service';
import { StoreService } from 'src/services/store/store.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { RenameModalComponent } from '../modals/rename-modal/rename-modal.component';
import { soundRenamedSocketResponse } from '../declarations';

@Component({
  selector: 'app-soundboard-menu',
  templateUrl: './soundboard-menu.component.html',
  styleUrls: ['./soundboard-menu.component.css']
})
export class SoundboardMenuComponent {

  searchValue: string = "";
  editMode = false;
  showHidden = false;

  hiddenSounds: string[] = []

  constructor(private socket: SocketService, private axios: AxiosService, public store: StoreService, public dialog: MatDialog) {

    this.socket.newSound$.subscribe((sound: string) => {
      this.store.sounds.push(sound);
      this.store.sortSounds();
    })

    this.socket.deleteSound$.subscribe((sound: string) => {
      this.store.sounds = this.store.sounds.filter((s) => {
        return s !== sound
      })
    })

    this.socket.soundRenamed$.subscribe((res: soundRenamedSocketResponse) => {
      let sounds = this.store.sounds;
      let soundsCopy = this.store.soundsCopy;
      let oldName = res.oldName;
      let newName = res.newName;
      for (let i = 0; i < sounds.length; i++) if (sounds[i] == oldName) sounds[i] = newName;
      for (let i = 0; i < soundsCopy.length; i++) if (soundsCopy[i] == oldName) soundsCopy[i] = newName;
      this.store.sortSounds();
    });
  }

  soundClicked(event: any, sound: string) {
    this.socket.playSound(sound);
  }

  textChange() {
    this.store.sounds = this.store.soundsCopy;
    this.store.sounds = this.store.sounds.filter((sound) => {
      var s = sound.toLocaleLowerCase();
      var search = this.searchValue.toLocaleLowerCase()
      return s.includes(search);
    })
  }

  clearText() {
    this.searchValue = "";
    this.store.sounds = this.store.soundsCopy;
  }

  delete(event: any, sound: string) {
    event.stopPropagation()
    this.socket.deleteSound(sound)
  }

  openDialog(event: Event, oldName: string) {
    event.stopPropagation()
    let dialog = this.dialog.open(RenameModalComponent, {
      disableClose: true,
      data: oldName,
      width: '40%',
    });

    dialog.afterClosed().subscribe(result => {
      if (result === undefined || result === null || result === '') return;

      var options: GetOptions = { url: "/sound" }
      options.params = {
        oldName: oldName,
        newName: result
      };

      this.axios.put(options).then((res) => {
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
}