import { TestBed, inject } from '@angular/core/testing';

import { CategoryGuardService } from './category-guard.service';

describe('CategoryGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryGuardService]
    });
  });

  it('should be created', inject([CategoryGuardService], (service: CategoryGuardService) => {
    expect(service).toBeTruthy();
  }));
});
