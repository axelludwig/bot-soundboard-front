import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Axios } from 'axios';
import { Sound, Tag } from 'src/app/declarations';
import { SuccessSnackbar } from 'src/app/snackbars/success-snackbar/success-snackbar';
import { AxiosService, GetOptions } from 'src/services/axios/axios.service';
import { StoreService } from 'src/services/store/store.service';


@Component({
  selector: 'app-tags-selector',
  templateUrl: './tags-selector.component.html',
  styleUrls: ['./tags-selector.component.css']
})
export class TagsSelectorComponent {
  public selectedTags: Tag[] = this.data.Tags;
  public availableTags: Tag[] = this.store.tags.filter((tag) => { return !this.selectedTags.some((t) => t.ID === tag.ID) });

  constructor(public dialog: MatDialogRef<TagsSelectorComponent>, private _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: Sound, private store: StoreService, private axios: AxiosService) { }

  setToSelected(tag: Tag) {
    this.selectedTags.push(tag);
    this.availableTags = this.availableTags.filter((t) => { return t.ID !== tag.ID });
  }

  removeFromSelected(tag: Tag) {
    this.selectedTags = this.selectedTags.filter((t) => { return t.ID !== tag.ID });
    this.availableTags.push(tag);
  }

  save() {
    var options: GetOptions = { url: "/sounds/" + this.data.ID }
    options.params = {
      name: this.data.Name,
      tags: this.selectedTags.map((t) => { return t.ID })
    };
    this.axios.put(options)
      .then((res) => {
        this.openSucessSnackBar();
        this.dialog.close();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  openSucessSnackBar() {
    this._snackBar.openFromComponent(SuccessSnackbar, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['sucess-snackbar'],
      data: { message: "tags successfully saved" }
    });
  }
}
