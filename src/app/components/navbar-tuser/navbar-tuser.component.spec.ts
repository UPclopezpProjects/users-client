import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTuserComponent } from './navbar-tuser.component';

describe('NavbarTuserComponent', () => {
  let component: NavbarTuserComponent;
  let fixture: ComponentFixture<NavbarTuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarTuserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarTuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
