import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, debounceTime } from 'rxjs';
import { SessionService } from 'src/services/session/session.service';
import { StoreService } from 'src/services/store/store.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css']
})
export class SettingsModalComponent {
  private primaryColorLocalSubject = new Subject<string>();
  private readonly debounceTimeMs = 10;

  public displayName: string = this.sessionService.getName();
  public pfpUrl: string = this.sessionService.getPfpUrl();

  constructor(private sessionService: SessionService, public dialog: MatDialogRef<SettingsModalComponent>, @Inject(MAT_DIALOG_DATA) public data: string, public store: StoreService) { }

  ngOnInit() {
    this.primaryColorLocalSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe(() => {
      this.updateThemeColor();
    });

    this.store.avoidDuplicates = JSON.parse(localStorage.getItem('avoidDuplicates') || "false");
  }

  ngOnDestroy() {
    this.primaryColorLocalSubject.complete();
  }

  debounce() {
    this.primaryColorLocalSubject.next('');
  }

  updateThemeColor() {
    this.store.changeThemeColor(this.store.primaryColor);
  }

  async pasteClipboard() {
    let clipboardContent = await navigator.clipboard.readText();
    if (clipboardContent) {
      this.store.primaryColor = clipboardContent;
      this.updateThemeColor();
    }
  }

  toggleAvoidDuplicates() {
    localStorage.setItem('avoidDuplicates', this.store.avoidDuplicates.toString());
  }

  disconnect() {
    this.sessionService.logout();
    this.dialog.close();
  }
}