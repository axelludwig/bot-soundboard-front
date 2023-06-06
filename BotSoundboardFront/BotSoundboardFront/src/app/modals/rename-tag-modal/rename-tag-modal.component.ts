import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rename-modal',
  templateUrl: './rename-tag-modal.component.html',
  styleUrls: ['./rename-tag-modal.component.css']
})
export class RenameTagModalComponent {
  constructor(public dialog: MatDialogRef<RenameTagModalComponent>, @Inject(MAT_DIALOG_DATA) public data: string) {
  }

  updateName() {
      if (this.data && this.data !== '') this.dialog.close(this.data);
  }
}
