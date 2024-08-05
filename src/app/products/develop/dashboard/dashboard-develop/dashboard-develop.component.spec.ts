import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDevelopComponent } from './dashboard-develop.component';

describe('DashboardDevelopComponent', () => {
  let component: DashboardDevelopComponent;
  let fixture: ComponentFixture<DashboardDevelopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardDevelopComponent]
    });
    fixture = TestBed.createComponent(DashboardDevelopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
