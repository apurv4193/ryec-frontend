import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInvestmentOpportunityDetailComponent } from './my-investment-opportunity-detail.component';

describe('MyInvestmentOpportunityDetailComponent', () => {
  let component: MyInvestmentOpportunityDetailComponent;
  let fixture: ComponentFixture<MyInvestmentOpportunityDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyInvestmentOpportunityDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInvestmentOpportunityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
