import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistartionPage } from './registartion.page';

describe('RegistartionPage', () => {
  let component: RegistartionPage;
  let fixture: ComponentFixture<RegistartionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistartionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistartionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
