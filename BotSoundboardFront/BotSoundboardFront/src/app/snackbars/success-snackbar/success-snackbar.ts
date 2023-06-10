import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";
import { StoreService } from "src/services/store/store.service";

@Component({
  selector: 'success-snackbar',
  templateUrl: 'success-snackbar.html',
  styleUrls: ['./success-snackbar.scss'],
})

export class SuccessSnackbar {
  public message: string = "";

  constructor(store: StoreService, @Inject(MAT_SNACK_BAR_DATA) public data: any) {
    if (data.message) {
      this.message = data.message;
    }
    store.soundName$.subscribe((name: string) => {
      this.message = name + " successfully uploaded";
    })
  }
}
