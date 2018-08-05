import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAgentComponent } from './become-agent.component';

describe('BecomeAgentComponent', () => {
  let component: BecomeAgentComponent;
  let fixture: ComponentFixture<BecomeAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomeAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
