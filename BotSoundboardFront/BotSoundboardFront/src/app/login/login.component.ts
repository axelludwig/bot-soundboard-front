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
  public authErrorMessage = '';
  private readonly authRedirectStorageKey = 'google-auth-redirect-at';
  private readonly authRedirectCooldownMs = 5000;

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
          localStorage.setItem('google-connected-user', JSON.stringify(res));
          localStorage.removeItem(this.authRedirectStorageKey);

          this.sessionStorage.googleToken = res.token;
          this.socketService.connectWithToken();

          this.sessionStorage.isLoggedIn = true;
          this.sessionStorage.mustUseSelectAccount = false;
          this.authErrorMessage = '';
        }
      })
      .catch((err: any) => {
        this.sessionStorage.isLoggedIn = false;
        const status = err?.status;

        if (status === 403) {
          this.authErrorMessage = "Connexion Google reussie, mais votre compte n'a pas acces a cette application.";
          return;
        }

        this.triggerGoogleAuthRedirect();
      })
  }

  loginWithGoogle() {
    this.triggerGoogleAuthRedirect();
  }

  private triggerGoogleAuthRedirect() {
    const now = Date.now();
    const lastRedirectRaw = localStorage.getItem(this.authRedirectStorageKey);
    const lastRedirectAt = lastRedirectRaw ? Number(lastRedirectRaw) : 0;

    if (Number.isFinite(lastRedirectAt) && now - lastRedirectAt < this.authRedirectCooldownMs) {
      this.authErrorMessage = 'Tentative de connexion deja en cours. Patientez quelques secondes puis reessayez.';
      return;
    }

    localStorage.setItem(this.authRedirectStorageKey, now.toString());
    window.location.href = environment.serverURL + '/auth/google' + (this.sessionStorage.mustUseSelectAccount ? '_select_account' : '');
  }
}