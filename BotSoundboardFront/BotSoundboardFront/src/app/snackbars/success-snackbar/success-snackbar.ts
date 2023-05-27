import { Component } from "@angular/core";
import { StoreService } from "src/services/store/store.service";

@Component({
  selector: 'success-snackbar',
  templateUrl: 'success-snackbar.html',
  styleUrls: ['./success-snackbar.scss'],
})

export class SuccessSnackbar {
  public name: string | undefined;

  constructor(store: StoreService) {
    store.soundName$.subscribe((name: string) => {
      this.name = name;
    })
  }
}
