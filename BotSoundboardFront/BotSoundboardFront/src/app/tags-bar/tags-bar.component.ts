import { ChangeDetectorRef, Component } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';
import { StoreService } from 'src/services/store/store.service';
import { Tag } from '../declarations';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-tags-bar',
  templateUrl: './tags-bar.component.html',
  styleUrls: ['./tags-bar.component.css']
})
export class TagsBarComponent {

  public tags: Tag[] = [];
  public selectedTags: string[] = [];
  public favoriteTags: string[] = [];

  constructor(private store: StoreService, private socketService: SocketService) {
    this.selectedTags = JSON.parse(localStorage.getItem('selectedTags') || "[]");
    this.favoriteTags = JSON.parse(localStorage.getItem('favoriteTags') || "[]");

    this.socketService.tags$.subscribe((tags: Tag[]) => {
      this.sortTags(tags);
    });
  }

  saveSelectedTags() {
    let selectedTagsString = JSON.stringify(this.selectedTags);
    localStorage.setItem('selectedTags', selectedTagsString);
  }

  saveFavoriteTags() {
    let favoriteTagsString = JSON.stringify(this.favoriteTags);
    localStorage.setItem('favoriteTags', favoriteTagsString);
  }

  sortTags(tags: Tag[]) {
    let selectedTagsList: Tag[] = [];
    let favoritesTagsList: Tag[] = [];
    let unselectedTagsList: Tag[] = [];

    for (let tag of tags) {
      if (this.selectedTags.includes(tag.Name)) selectedTagsList.push(tag);
      else if (this.favoriteTags.includes(tag.Name)) favoritesTagsList.push(tag);
      else unselectedTagsList.push(tag);
    }
    this.tags = this.sortArray(selectedTagsList).concat(this.sortArray(favoritesTagsList)).concat(this.sortArray(unselectedTagsList));
  }

  sortArray(array: Tag[]) {
    return array.sort((a, b) => {
      if (a.Name.toLowerCase() < b.Name.toLowerCase()) return -1;
      else if (a.Name.toLowerCase() > b.Name.toLowerCase()) return 1;
      else return 0;
    });
  }

  onTagClick(event: any, tag: Tag) {
    if (!event.isUserInput) return;
    if (event.selected && !this.selectedTags.includes(tag.Name)) this.selectedTags.push(tag.Name);
    else this.selectedTags = this.selectedTags.filter((t) => t !== tag.Name);
    this.saveSelectedTags();
    this.sortTags(this.tags);
  }

  toggleFavorite(event: any, name: string, setFavorite: boolean) {
    event.stopPropagation();
    if (setFavorite) this.favoriteTags.push(name);
    else this.favoriteTags = this.favoriteTags.filter((tag) => tag !== name);
    this.saveFavoriteTags();
    this.sortTags(this.tags);
  }
}
