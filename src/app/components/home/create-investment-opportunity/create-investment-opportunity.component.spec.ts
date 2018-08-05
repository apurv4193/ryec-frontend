import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInvestmentOpportunityComponent } from './create-investment-opportunity.component';

describe('CreateInvestmentOpportunityComponent', () => {
  let component: CreateInvestmentOpportunityComponent;
  let fixture: ComponentFixture<CreateInvestmentOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInvestmentOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInvestmentOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
