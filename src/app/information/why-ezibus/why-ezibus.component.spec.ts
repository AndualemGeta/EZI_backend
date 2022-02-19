import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyEzibusComponent } from './why-ezibus.component';

describe('WhyEzibusComponent', () => {
  let component: WhyEzibusComponent;
  let fixture: ComponentFixture<WhyEzibusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhyEzibusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyEzibusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
