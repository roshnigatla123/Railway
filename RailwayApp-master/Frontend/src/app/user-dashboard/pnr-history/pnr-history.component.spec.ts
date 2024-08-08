import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PnrHistoryComponent } from './pnr-history.component';

describe('PnrHistoryComponent', () => {
  let component: PnrHistoryComponent;
  let fixture: ComponentFixture<PnrHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PnrHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PnrHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
