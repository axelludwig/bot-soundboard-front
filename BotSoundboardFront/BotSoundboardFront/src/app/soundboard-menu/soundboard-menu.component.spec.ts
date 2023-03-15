import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundboardMenuComponent } from './soundboard-menu.component';

describe('SoundboardMenuComponent', () => {
  let component: SoundboardMenuComponent;
  let fixture: ComponentFixture<SoundboardMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoundboardMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoundboardMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
