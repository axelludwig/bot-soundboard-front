import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css']
})
export class SettingsModalComponent {
  constructor(public dialog: MatDialogRef<SettingsModalComponent>, @Inject(MAT_DIALOG_DATA) public data: string) {
  }

  updateName() {
    if (this.data && this.data !== '') this.dialog.close(this.data);
  }
}
