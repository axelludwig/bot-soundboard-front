import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AxiosService } from "../axios/axios.service";

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    constructor(private axios: AxiosService) { }

    public isLoggedIn = false;

    logout() {
        localStorage.removeItem('google-connected-user');
        this.axios.get({ url: "/logout" }).then(() => {
            this.isLoggedIn = false;
        });
    }

    hasRessource(ressource: string): boolean {
        let userData = localStorage.getItem('google-connected-user');
        if (!userData || userData === "undefined") {
            return false;
        }

        let ressources: any[] = JSON.parse(userData)?.userData.ressources;
        let hasRessource: boolean = ressources.map(x => x.Name).includes(ressource);
        console.log(ressources);
        return hasRessource;
    }
}
