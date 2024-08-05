import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNotasComponent } from './dashboard-notas.component';

describe('DashboardNotasComponent', () => {
  let component: DashboardNotasComponent;
  let fixture: ComponentFixture<DashboardNotasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardNotasComponent]
    });
    fixture = TestBed.createComponent(DashboardNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
