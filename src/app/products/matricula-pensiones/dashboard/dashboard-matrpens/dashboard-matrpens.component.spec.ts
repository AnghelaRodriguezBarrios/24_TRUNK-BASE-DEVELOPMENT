import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMatrpensComponent } from './dashboard-matrpens.component';

describe('DashboardMatrpensComponent', () => {
  let component: DashboardMatrpensComponent;
  let fixture: ComponentFixture<DashboardMatrpensComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardMatrpensComponent]
    });
    fixture = TestBed.createComponent(DashboardMatrpensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
