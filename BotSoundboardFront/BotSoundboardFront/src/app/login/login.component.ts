import { Component } from '@angular/core';
import { AxiosService, GetOptions } from 'src/services/axios/axios.service';
import { StoreService } from 'src/services/store/store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private axiosService: AxiosService, private storeService: StoreService) { }

  ngOnInit() {
    this.getUserInfos();
  }

  login() {
    window.location.href = 'http://localhost:3000/auth/google';
  }

  logout() {

  }

  getUserInfos() {
    var options: GetOptions = {
      url: "/profile"
    }
    this.axiosService.get(options).then((res: any) => {
      if (res) {
        console.log(res);
        this.storeService.isLoggedIn = true;
      }
      else
        throw new Error("null response from server");
    })
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          // Ignore the 403 error
        } else {
          console.error("An error occurred:", err);
          // You can also handle other specific errors here if needed
        }
      })
  }
}