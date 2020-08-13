import { TestBed, async, inject } from '@angular/core/testing';

import { DataAvailableGuard } from './data-available.guard';

describe('DataAvailableGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataAvailableGuard]
    });
  });

  it('should ...', inject([DataAvailableGuard], (guard: DataAvailableGuard) => {
    expect(guard).toBeTruthy();
  }));
});
