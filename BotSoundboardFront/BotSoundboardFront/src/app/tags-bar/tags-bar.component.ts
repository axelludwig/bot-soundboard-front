import { Component, ElementRef, ViewChild } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';
import { StoreService } from 'src/services/store/store.service';
import { Tag } from '../declarations';
import { AxiosService, GetOptions } from 'src/services/axios/axios.service';
import { MatDialog } from '@angular/material/dialog';
import { RenameTagModalComponent } from '../modals/rename-tag-modal/rename-tag-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tags-bar',
  templateUrl: './tags-bar.component.html',
  styleUrls: ['./tags-bar.component.css']
})
export class TagsBarComponent {
  public rightClickedTag: Tag | null = null;
  @ViewChild('menu') menu: ElementRef | undefined;

  public fossasonText: string = "";

  constructor(public store: StoreService, private socketService: SocketService, private axios: AxiosService, public dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.store.selectedTags = JSON.parse(localStorage.getItem('selectedTags') || "[]");
    this.store.selectedTagsIds = this.store.selectedTags.map((tag) => tag.ID);

    this.store.favoriteTags = JSON.parse(localStorage.getItem('favoriteTags') || "[]");
    this.store.favoriteTagsIds = this.store.favoriteTags.map((tag) => tag.ID);

    this.socketService.tags$.subscribe((tags: Tag[]) => {
      this.store.sortTags(tags);
    });

    this.fossasonText = this.showRandomly() ? "fosssson™" : "fossason";
  }

  saveSelectedTags() {
    let selectedTagsString = JSON.stringify(this.store.selectedTags);
    localStorage.setItem('selectedTags', selectedTagsString);
  }

  saveFavoriteTags() {
    let favoriteTagsString = JSON.stringify(this.store.favoriteTags);
    localStorage.setItem('favoriteTags', favoriteTagsString);
  }

  onTagClick(event: any, tag: Tag) {
    if (!event.isUserInput) return;
    if (event.selected && !this.store.selectedTags.includes(tag)) {
      this.store.selectedTags.push(tag);
      this.store.selectedTagsIds.push(tag.ID);
    } else {
      this.store.selectedTags = this.store.selectedTags.filter((t) => t.ID !== tag.ID);
      this.store.selectedTagsIds = this.store.selectedTagsIds.filter((id) => id !== tag.ID);
    }
    this.saveSelectedTags();
    this.store.sortTags(this.store.tags);
    this.store.updateFilteredSounds();
  }

  toggleFavorite(event: any, tag: Tag, setFavorite: boolean) {
    event.stopPropagation();
    if (setFavorite) {
      this.store.favoriteTags.push(tag);
      this.store.favoriteTagsIds.push(tag.ID);
    }
    else {
      this.store.favoriteTags = this.store.favoriteTags.filter((listTag) => listTag.ID !== tag.ID);
      this.store.favoriteTagsIds = this.store.favoriteTagsIds.filter((id) => id !== tag.ID);
    }
    this.saveFavoriteTags();
    this.store.sortTags(this.store.tags);
  }


  openDialog(tag: Tag) {
    let dialog = this.dialog.open(RenameTagModalComponent, {
      disableClose: false,
      data: tag.Name,
      width: '40%',
    });

    dialog.afterClosed().subscribe(result => {
      if (result === undefined || result === null || result === '') return;

      var options: GetOptions = { url: "/tags/" + tag.ID }
      options.params = {
        newName: result
      };
      this.axios.put(options)
        .then((res) => {
          // this.store.renameLocalStorageTags(tag, result);
        })
        .catch((err) => {
          console.log(err);
        })
    });
  }

  public showElement(tag: Tag): boolean {
    return this.store.favoriteTags.some(item => item.ID === tag.ID);
  }

  renameTag(tag: Tag) {
    console.log(tag);
    // var options: GetOptions = { url: "/sound" + tag.ID }
    // options.params = {
    //   newName: tag.Name
    // };
    // this.axios.put(options).then((res) => {
    // })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  deleteTag(tag: Tag) {
    console.log(tag);
  }

  setRightClickedTag(tag: Tag) {
    this.rightClickedTag = tag;
  }

  showRandomly(): boolean {
    return Math.random() < 0.01;
  }
}
