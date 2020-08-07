import { TestBed } from '@angular/core/testing';

import { FormErrorsService } from './form-errors.service';

describe('FormErrorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormErrorsService = TestBed.get(FormErrorsService);
    expect(service).toBeTruthy();
  });
});
