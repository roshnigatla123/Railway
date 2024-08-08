import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplSeasonsComponent } from './expl-seasons.component';

describe('ExplSeasonsComponent', () => {
  let component: ExplSeasonsComponent;
  let fixture: ComponentFixture<ExplSeasonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplSeasonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplSeasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
