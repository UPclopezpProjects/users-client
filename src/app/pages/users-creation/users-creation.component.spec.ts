import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCreationComponent } from './users-creation.component';

describe('UsersCreationComponent', () => {
  let component: UsersCreationComponent;
  let fixture: ComponentFixture<UsersCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
