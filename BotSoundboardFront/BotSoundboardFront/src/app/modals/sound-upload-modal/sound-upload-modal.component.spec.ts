import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundUploadModalComponent } from './sound-upload-modal.component';

describe('SoundUploadModalComponent', () => {
  let component: SoundUploadModalComponent;
  let fixture: ComponentFixture<SoundUploadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoundUploadModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoundUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
