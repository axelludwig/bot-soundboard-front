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
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'
import { ReactiveFormsModule} from '@angular/forms';
import { MatRadioModule} from '@angular/material/radio';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    GuildsListComponent,
    SoundboardMenuComponent
  ],
  imports: [MatRadioModule, ReactiveFormsModule,CommonModule,MatDividerModule, MatProgressSpinnerModule, MatSliderModule, MatIconModule, FormsModule,
    BrowserModule, SocketIoModule.forRoot(config), MatSlideToggleModule, MatCheckboxModule, MatButtonModule, BrowserAnimationsModule, MatInputModule
  ],
  exports: [],
  providers: [AxiosService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
