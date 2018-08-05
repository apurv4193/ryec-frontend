import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentOpportunityComponent } from './investment-opportunity.component';

describe('InvestmentOpportunityComponent', () => {
  let component: InvestmentOpportunityComponent;
  let fixture: ComponentFixture<InvestmentOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
