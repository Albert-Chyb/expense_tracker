import { TestBed } from '@angular/core/testing';

import { TransactionsGroupsService } from './transactions-groups.service';

describe('TransactionsGroupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransactionsGroupsService = TestBed.get(TransactionsGroupsService);
    expect(service).toBeTruthy();
  });
});
