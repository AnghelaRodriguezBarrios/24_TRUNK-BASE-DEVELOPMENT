import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageEscuelaPadresComponent } from './landing-page-escuela-padres.component';

describe('LandingPageEscuelaPadresComponent', () => {
  let component: LandingPageEscuelaPadresComponent;
  let fixture: ComponentFixture<LandingPageEscuelaPadresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPageEscuelaPadresComponent]
    });
    fixture = TestBed.createComponent(LandingPageEscuelaPadresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
