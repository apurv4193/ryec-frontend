import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBusinessDetailComponent } from './my-business-detail.component';

describe('MyBusinessDetailComponent', () => {
  let component: MyBusinessDetailComponent;
  let fixture: ComponentFixture<MyBusinessDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBusinessDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBusinessDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
