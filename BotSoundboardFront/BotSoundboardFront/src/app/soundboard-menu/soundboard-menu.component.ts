import { Component, Input, SimpleChanges, OnChanges, Inject } from '@angular/core';
import { AxiosService, GetOptions } from "src/services/axios/axios.service"
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from 'src/services/socket/socket.service';
import { StoreService } from 'src/services/store/store.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { RenameModalComponent } from '../modals/rename-modal/rename-modal.component';
import { Sound, soundRenamedSocketResponse } from '../declarations';

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

    this.socket.newSound$.subscribe((sound: Sound) => {
      console.log(sound);
      this.store.sounds.push(sound);
      this.store.sortSounds();
    })

    this.socket.deleteSound$.subscribe((soundId: number) => {
      this.store.sounds = this.store.sounds.filter((s) => {
        return s.ID !== soundId
      })
    })

    this.socket.soundRenamed$.subscribe((res: soundRenamedSocketResponse) => {
      let sounds = this.store.sounds;
      let soundsCopy = this.store.soundsCopy;
      let soundId = res.id;
      let newName = res.newName;
      for (let i = 0; i < sounds.length; i++) if (sounds[i].ID == soundId) sounds[i].Name = newName;
      for (let i = 0; i < soundsCopy.length; i++) if (soundsCopy[i].ID == soundId) soundsCopy[i].Name = newName;
      this.store.sortSounds();
    });
  }

  soundClicked(event: any, soundId: number) {
    this.socket.playSound(soundId);
  }

  textChange() {
    this.store.sounds = this.store.soundsCopy;
    this.store.sounds = this.store.sounds.filter((sound) => {
      var s = sound.Name.toLocaleLowerCase();
      var search = this.searchValue.toLocaleLowerCase()
      return s.includes(search);
    })
  }

  clearText() {
    this.searchValue = "";
    this.store.sounds = this.store.soundsCopy;
  }

  delete(event: any, soundId: number) {
    event.stopPropagation()
    this.socket.deleteSound(soundId)
  }

  openDialog(event: Event, soundId: number, oldName: string) {
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
        id: soundId,
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