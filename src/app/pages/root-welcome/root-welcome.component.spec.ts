import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootWelcomeComponent } from './root-welcome.component';

describe('RootWelcomeComponent', () => {
  let component: RootWelcomeComponent;
  let fixture: ComponentFixture<RootWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootWelcomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
