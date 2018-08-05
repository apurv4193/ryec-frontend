import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentBusinessListComponent } from './agent-business-list.component';

describe('AgentBusinessListComponent', () => {
  let component: AgentBusinessListComponent;
  let fixture: ComponentFixture<AgentBusinessListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentBusinessListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentBusinessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
