import { Component } from '@angular/core';
import { StoreService } from 'src/services/store/store.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent {
  constructor(public store: StoreService) {
  }
}
