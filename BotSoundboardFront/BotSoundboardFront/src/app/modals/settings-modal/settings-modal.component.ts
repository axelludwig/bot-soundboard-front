import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, debounceTime } from 'rxjs';
import { AxiosService } from 'src/services/axios/axios.service';
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

  public status: boolean = false;
  public loaded: boolean = false;

  public intervalId: any;


  constructor(private sessionService: SessionService, public dialog: MatDialogRef<SettingsModalComponent>, @Inject(MAT_DIALOG_DATA) public data: string, public store: StoreService, private axios: AxiosService) { }

  ngOnInit() {
    this.primaryColorLocalSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe(() => {
      this.updateThemeColor();
    });

    this.store.avoidDuplicates = JSON.parse(localStorage.getItem('avoidDuplicates') || "false");

    this.intervalId = setInterval(() => {
      this.getStatus();
    }, 1000);
  }

  ngOnDestroy() {
    this.primaryColorLocalSubject.complete();

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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

  getStatus() {
    let options = {
      url: 'https://linkenparis.com:5000/status',
      withCredentials: true // Inclure les informations d'identification
    };

    this.axios.getOutside(options)
      .then((response: any) => {
        // Accéder à response.data.status au lieu de response.status
        this.status = response.data.status === 'success';
        console.log('Statut du serveur:', this.status);
      })
  }
}