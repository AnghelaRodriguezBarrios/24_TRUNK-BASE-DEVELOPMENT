import { TestBed } from '@angular/core/testing';

import { CourseCompetencesService } from './course-competences.service';

describe('CourseCompetencesService', () => {
  let service: CourseCompetencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseCompetencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
