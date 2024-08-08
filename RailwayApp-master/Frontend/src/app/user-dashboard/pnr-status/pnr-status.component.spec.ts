import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PnrStatusComponent } from './pnr-status.component';

describe('PnrStatusComponent', () => {
  let component: PnrStatusComponent;
  let fixture: ComponentFixture<PnrStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PnrStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PnrStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
