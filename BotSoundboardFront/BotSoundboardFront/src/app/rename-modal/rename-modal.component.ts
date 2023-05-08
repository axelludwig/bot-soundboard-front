import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rename-modal',
  templateUrl: './rename-modal.component.html',
  styleUrls: ['./rename-modal.component.css']
})
export class RenameModalComponent {
  constructor(public dialog: MatDialogRef<RenameModalComponent>, @Inject(MAT_DIALOG_DATA) public data: string) {
  }

  updateName() {
    console.log(this.data);
    if (this.data && this.data !== '') this.dialog.close(this.data);
  }
}
