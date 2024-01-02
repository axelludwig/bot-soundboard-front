import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, debounceTime } from 'rxjs';
import { StoreService } from 'src/services/store/store.service';


@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css']
})
export class SettingsModalComponent {

  public primaryColorLocal: string = this.store.primaryColor;
  private primaryColorLocalSubject = new Subject<string>();

  private readonly debounceTimeMs = 10; // Set the debounce time (in milliseconds)

  ngOnInit() {
    this.primaryColorLocalSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe(() => {
      console.log("debounce");
      
      this.updateThemeColor();
    });
  }

  ngOnDestroy() {
    this.primaryColorLocalSubject.complete();
  }

  constructor(public dialog: MatDialogRef<SettingsModalComponent>, @Inject(MAT_DIALOG_DATA) public data: string, public store: StoreService) {
  }

  debounce() {
    this.primaryColorLocalSubject.next('');
  }

  updateThemeColor() {
    this.store.changeThemeColor(this.primaryColorLocal)
  }
}