import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplIndiaComponent } from './expl-india.component';

describe('ExplIndiaComponent', () => {
  let component: ExplIndiaComponent;
  let fixture: ComponentFixture<ExplIndiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplIndiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplIndiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
