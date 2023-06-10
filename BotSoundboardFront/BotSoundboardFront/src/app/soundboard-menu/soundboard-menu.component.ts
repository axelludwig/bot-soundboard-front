import { Component, Input, SimpleChanges, OnChanges, Inject } from '@angular/core';
import { AxiosService, GetOptions } from "src/services/axios/axios.service";
import { SocketService } from 'src/services/socket/socket.service';
import { StoreService } from 'src/services/store/store.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RenameModalComponent } from '../modals/rename-modal/rename-modal.component';
import { Sound, soundRenamedSocketResponse } from '../declarations';
import { TagsSelectorComponent } from '../modals/tags-selector/tags-selector.component';


@Component({
  selector: 'app-soundboard-menu',
  templateUrl: './soundboard-menu.component.html',
  styleUrls: ['./soundboard-menu.component.css']
})
export class SoundboardMenuComponent {

  editMode = false;
  showHidden = false;
  hiddenSounds: string[] = []

  constructor(private socket: SocketService, private axios: AxiosService, public store: StoreService, public dialog: MatDialog) {

    this.socket.newSound$.subscribe((sound: Sound) => {
      this.store.sounds.push(sound);
      this.store.soundsCopy.push(sound);
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
    this.store.updateFilteredSounds();
  }

  clearText() {
    this.store.searchValue = "";
    this.store.sounds = this.store.soundsCopy;
    this.store.updateFilteredSounds();
  }

  delete(sound: Sound) {
    this.socket.deleteSound(sound.ID)
  }

  openDialog(event: Event, sound: Sound) {
    // event.stopPropagation()
    let dialog = this.dialog.open(RenameModalComponent, {
      disableClose: true,
      data: sound.Name,
      width: '40%',
    });

    dialog.afterClosed().subscribe(result => {
      if (result === undefined || result === null || result === '') return;

      var options: GetOptions = { url: "/sound" }
      options.params = {
        id: sound.ID,
        newName: result
      };

      this.axios.put(options).then((res) => {
      })
        .catch((err) => {
          console.log(err);
        })
    });
  }

  test(event: any) {
    console.log(event);
  }

  openTagsSelectorDialog(sound: Sound) {
    let dialog = this.dialog.open(TagsSelectorComponent, {
      disableClose: false,
      data: sound,
      panelClass: 'tags-selector-dialog',
    });

    dialog.afterClosed().subscribe(result => {

    })
  }

  openRenameContextMenu(sound: Sound) {
    let dialog = this.dialog.open(RenameModalComponent, {
      disableClose: false,
      data: sound.Name,
      width: '40%',
    });

    dialog.afterClosed().subscribe(result => {
      if (result === undefined || result === null || result === '') return;

      var options: GetOptions = { url: "/sound" }
      options.params = {
        id: sound.ID,
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