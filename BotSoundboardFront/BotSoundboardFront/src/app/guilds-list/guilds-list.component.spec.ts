import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildsListComponent } from './guilds-list.component';

describe('GuildsListComponent', () => {
  let component: GuildsListComponent;
  let fixture: ComponentFixture<GuildsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuildsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuildsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
