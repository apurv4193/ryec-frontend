import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessOwnerDetailComponent } from './business-owner-detail.component';

describe('BusinessOwnerDetailComponent', () => {
  let component: BusinessOwnerDetailComponent;
  let fixture: ComponentFixture<BusinessOwnerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessOwnerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessOwnerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
