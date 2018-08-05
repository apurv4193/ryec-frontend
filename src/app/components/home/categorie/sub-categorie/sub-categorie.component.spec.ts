import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategorieComponent } from './sub-categorie.component';

describe('SubCategorieComponent', () => {
  let component: SubCategorieComponent;
  let fixture: ComponentFixture<SubCategorieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCategorieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
