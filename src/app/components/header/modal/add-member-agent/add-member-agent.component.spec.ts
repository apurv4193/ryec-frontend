import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberAgentComponent } from './add-member-agent.component';

describe('AddMemberAgentComponent', () => {
  let component: AddMemberAgentComponent;
  let fixture: ComponentFixture<AddMemberAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemberAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
