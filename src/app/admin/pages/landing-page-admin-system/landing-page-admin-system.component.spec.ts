import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageAdminSystemComponent } from './landing-page-admin-system.component';

describe('LandingPageAdminSystemComponent', () => {
  let component: LandingPageAdminSystemComponent;
  let fixture: ComponentFixture<LandingPageAdminSystemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPageAdminSystemComponent]
    });
    fixture = TestBed.createComponent(LandingPageAdminSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
