import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootAdminLayoutComponent } from './root-admin-layout.component';

describe('RootAdminLayoutComponent', () => {
  let component: RootAdminLayoutComponent;
  let fixture: ComponentFixture<RootAdminLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootAdminLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootAdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
