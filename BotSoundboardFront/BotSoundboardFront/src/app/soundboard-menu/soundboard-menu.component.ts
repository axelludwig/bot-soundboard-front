import { Component, Input, SimpleChanges, OnChanges, Inject, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AxiosService, GetOptions } from "src/services/axios/axios.service";
import { SocketService } from 'src/services/socket/socket.service';
import { StoreService } from 'src/services/store/store.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RenameModalComponent } from '../modals/rename-modal/rename-modal.component';
import { Sound, soundRenamedSocketResponse } from '../declarations';
import { TagsSelectorComponent } from '../modals/tags-selector/tags-selector.component';
import { SoundUploadModalComponent } from '../modals/sound-upload-modal/sound-upload-modal.component';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-soundboard-menu',
  templateUrl: './soundboard-menu.component.html',
  styleUrls: ['./soundboard-menu.component.css']
})
export class SoundboardMenuComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  editMode = false;
  showHidden = false;
  hiddenSounds: string[] = []
  dataSource: MatTableDataSource<Sound> = new MatTableDataSource<Sound>([]);

  constructor(private socket: SocketService, private axios: AxiosService, public store: StoreService, public dialog: MatDialog) {
    this.store.soundsObservable.subscribe((sounds: Sound[]) => {
      this.dataSource.data = sounds;
    });

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

    this.socket.sounds$.subscribe((sounds: Sound[]) => {
      this.store.soundsObservable.next(sounds);
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (sound: any, property) => {
        switch (property) {
          case 'title': return sound.Name;
          case 'tags': return sound.Tags;
          case 'duration': return sound.SoundLength;
          case 'addedDate': return sound.PublicationDate;
          default: return sound[property];
        }
      };
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  soundClicked(event: any, soundId: number) {
    this.socket.playSound(soundId);
  }

  textChange() {
    this.store.updateFilteredSounds();
  }

  clearText() {
    this.store.searchValue = "";
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

  openUploadDialog() {
    let dialog = this.dialog.open(SoundUploadModalComponent, {
      height: '60%',
      width: '40%',
    });

    dialog.afterClosed().subscribe(result => {
      if (result === undefined || result === null || result === '') return;
    });
  }
}