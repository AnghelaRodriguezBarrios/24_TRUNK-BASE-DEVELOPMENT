import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageMatriculaPensionesComponent } from './landing-page-matricula-pensiones.component';

describe('LandingPageMatriculaPensionesComponent', () => {
  let component: LandingPageMatriculaPensionesComponent;
  let fixture: ComponentFixture<LandingPageMatriculaPensionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPageMatriculaPensionesComponent]
    });
    fixture = TestBed.createComponent(LandingPageMatriculaPensionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
