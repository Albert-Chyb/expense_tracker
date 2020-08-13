import { TestBed, async, inject } from '@angular/core/testing';

import { DataUnavailableGuard } from './data-unavailable.guard';

describe('DataUnavailableGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataUnavailableGuard]
    });
  });

  it('should ...', inject([DataUnavailableGuard], (guard: DataUnavailableGuard) => {
    expect(guard).toBeTruthy();
  }));
});
