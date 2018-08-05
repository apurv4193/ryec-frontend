import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentOpportunityDetailComponent } from './investment-opportunity-detail.component';

describe('InvestmentOpportunityDetailComponent', () => {
  let component: InvestmentOpportunityDetailComponent;
  let fixture: ComponentFixture<InvestmentOpportunityDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentOpportunityDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentOpportunityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
