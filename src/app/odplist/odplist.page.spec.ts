import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdplistPage } from './odplist.page';

describe('OdplistPage', () => {
  let component: OdplistPage;
  let fixture: ComponentFixture<OdplistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdplistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdplistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
