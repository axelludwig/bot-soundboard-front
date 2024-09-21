import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AxiosService } from 'src/services/axios/axios.service';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GuildsListComponent } from './guilds-list/guilds-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SoundboardMenuComponent } from './soundboard-menu/soundboard-menu.component';
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { environment } from 'src/environments/environment';
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { QueueComponent } from './queue/queue.component';
import { AudioEditorComponent } from './audio-editor/audio-editor.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RenameModalComponent } from './modals/rename-modal/rename-modal.component';
import { SoundUploadModalComponent } from './modals/sound-upload-modal/sound-upload-modal.component';
import { DeleteSoundModalComponent } from './modals/delete-sound-modal/delete-sound-modal.component';
import { RenameTagModalComponent } from './modals/rename-tag-modal/rename-tag-modal.component';
import { SettingsModalComponent } from './modals/settings-modal/settings-modal.component';
import { BlindTestModalComponent } from './modals/blind-test-modal/blind-test-modal.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadingSnackbar } from './snackbars/loading-snackbar/loading-snackbar';
import { PlayerComponent } from './player/player.component';
import { TagsBarComponent } from './tags-bar/tags-bar.component';
import { MatChipsModule } from '@angular/material/chips';
import { ContextMenuComponent } from './context-menu-component/context-menu-component';
import { MatMenuModule } from '@angular/material/menu';
import { SoundTimerComponent } from './player/sound-timer/sound-timer.component';
import { TagsSelectorComponent } from './modals/tags-selector/tags-selector.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularSplitModule } from 'angular-split';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { LoginComponent } from './login/login.component';
import { SessionService } from 'src/services/session/session.service';

// const config: SocketIoConfig = { url: environment.serverURL, options: { auth: { token: googleToken } } };
const config: SocketIoConfig = {
  url: environment.serverURL,
  options: {
    auth: {
      token: null  // Le token sera ajouté plus tard
    },
    autoConnect: false  // Ne pas se connecter automatiquement
  }
};

@NgModule({
  declarations: [
    AppComponent,
    GuildsListComponent,
    SoundboardMenuComponent,
    QueueComponent,
    AudioEditorComponent,
    LoadingSnackbar,
    PlayerComponent,
    TagsBarComponent,
    SoundTimerComponent,
    TagsBarComponent,
    ContextMenuComponent,
    TagsSelectorComponent,
    LoginComponent,
    SoundUploadModalComponent,
    DeleteSoundModalComponent,
    RenameTagModalComponent,
    RenameModalComponent,
    SettingsModalComponent,
    BlindTestModalComponent
  ],
  imports: [AngularSplitModule,
    MatMenuModule,
    MatTooltipModule,
    MatRadioModule, MatChipsModule,
    MatSnackBarModule,
    MatCardModule,
    ReactiveFormsModule,
    CommonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatIconModule, FormsModule,
    BrowserModule,
    SocketIoModule.forRoot(config),
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CdkDropList,
    DragDropModule

  ],
  exports: [],
  providers: [AxiosService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
