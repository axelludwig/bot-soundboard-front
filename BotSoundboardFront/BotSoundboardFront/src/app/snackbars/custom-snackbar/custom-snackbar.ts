import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";
import { StoreService } from "src/services/store/store.service";

@Component({
  selector: 'custom-snackbar',
  templateUrl: 'custom-snackbar.html',
  styleUrls: ['./custom-snackbar.scss'],
})

export class CustomSnackbar {
  public message: string = "";

  constructor(store: StoreService, @Inject(MAT_SNACK_BAR_DATA) public data: any) {
    if (data.message) {
      this.message = data.message;
    }
    
  }
}
