import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCompetencesComponent } from './course-competences.component';

describe('CourseCompetencesComponent', () => {
  let component: CourseCompetencesComponent;
  let fixture: ComponentFixture<CourseCompetencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseCompetencesComponent]
    });
    fixture = TestBed.createComponent(CourseCompetencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
