import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPadresComponent } from './dashboard-padres.component';

describe('DashboardPadresComponent', () => {
  let component: DashboardPadresComponent;
  let fixture: ComponentFixture<DashboardPadresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPadresComponent]
    });
    fixture = TestBed.createComponent(DashboardPadresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
