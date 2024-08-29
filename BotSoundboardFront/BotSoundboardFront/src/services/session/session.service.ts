import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AxiosService } from "../axios/axios.service";

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    constructor(private router: Router, private axios: AxiosService) { }

    public isLoggedIn = false;
    // public isLoggedIn = true;

    logout() {
        localStorage.removeItem('google-connected-user');
        this.axios.get({ url: "/logout" });
        // this.router.navigate([['/login']]);
        window.location.replace("./login");
        this.isLoggedIn = false;
    }
}
