import { TestBed, inject } from '@angular/core/testing';

import { HttpWebService } from './http-web.service';

describe('HttpWebService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpWebService]
    });
  });

  it('should be created', inject([HttpWebService], (service: HttpWebService) => {
    expect(service).toBeTruthy();
  }));
});
