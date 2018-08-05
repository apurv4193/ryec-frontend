import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AZcategoriesComponent } from './a-zcategories.component';

describe('AZcategoriesComponent', () => {
  let component: AZcategoriesComponent;
  let fixture: ComponentFixture<AZcategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AZcategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AZcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
