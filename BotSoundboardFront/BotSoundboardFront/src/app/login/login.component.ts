import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AxiosService, GetOptions } from 'src/services/axios/axios.service';
import { StoreService } from 'src/services/store/store.service';
import { SessionService } from 'src/services/session/session.service';
import { environment } from 'src/environments/environment';
import { SocketService } from 'src/services/socket/socket.service';
import { GoogleToken } from 'src/types';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private axiosService: AxiosService, private storeService: StoreService, private sessionStorage: SessionService, private socketService: SocketService) { }

  ngOnInit() {
    this.getUserInfos();
  }

  getUserInfos() {
    var options: GetOptions = {
      url: "/profile"
    }
    this.axiosService.get(options)
      .then((res: any) => {
        if (res) {
          console.log(res);
          localStorage.setItem('google-connected-user', JSON.stringify(res));

          this.sessionStorage.googleToken = res.token;
          this.socketService.connectWithToken(res.id_token);

          this.sessionStorage.isLoggedIn = true;
          this.sessionStorage.mustUseSelectAccount = false;
        }
      })
      .catch((err) => {
        //On est pas connecté, go se connecter !
        this.sessionStorage.isLoggedIn = false;
        window.location.href = environment.serverURL + '/auth/google' + (this.sessionStorage.mustUseSelectAccount ? '_select_account' : '');
      })
  }
}