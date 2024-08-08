import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplMaharajaComponent } from './expl-maharaja.component';

describe('ExplMaharajaComponent', () => {
  let component: ExplMaharajaComponent;
  let fixture: ComponentFixture<ExplMaharajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplMaharajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplMaharajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
