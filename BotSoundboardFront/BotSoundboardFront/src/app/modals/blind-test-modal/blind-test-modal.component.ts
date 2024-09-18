import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StoreService } from 'src/services/store/store.service';

@Component({
  selector: 'app-blind-test-modal',
  templateUrl: './blind-test-modal.component.html',
  styleUrls: ['./blind-test-modal.component.css']
})
export class BlindTestModalComponent {

  constructor(public dialog: MatDialogRef<BlindTestModalComponent>, @Inject(MAT_DIALOG_DATA) public data: string, public store: StoreService) { }

  ngOnInit() { }

  slideToggleChange(event: any) {
    // this.store.blindTestEnabled = event.checked;
    // this.store.startBlindTest();

    if (event.checked) {
      this.store.startBlindTest();
    } else {
      this.store.stopBlindTest();
    }
  }

  takeLead() {
    this.store.takeLead();
  }

  
}