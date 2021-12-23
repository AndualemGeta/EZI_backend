import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToBookComponent } from './how-to-book.component';

describe('HowToBookComponent', () => {
  let component: HowToBookComponent;
  let fixture: ComponentFixture<HowToBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowToBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
