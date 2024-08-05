import { TestBed } from '@angular/core/testing';

import { ApoderadoService } from './Apoderado.service';

describe('ApoderadoService', () => {
  let service: ApoderadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApoderadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
