import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageGestionNotasComponent } from './landing-page-gestion-notas.component';

describe('LandingPageGestionNotasComponent', () => {
  let component: LandingPageGestionNotasComponent;
  let fixture: ComponentFixture<LandingPageGestionNotasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPageGestionNotasComponent]
    });
    fixture = TestBed.createComponent(LandingPageGestionNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
