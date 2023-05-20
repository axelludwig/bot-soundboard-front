import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSoundModalComponent } from './delete-sound-modal.component';

describe('DeleteSoundModalComponent', () => {
  let component: DeleteSoundModalComponent;
  let fixture: ComponentFixture<DeleteSoundModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSoundModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSoundModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
