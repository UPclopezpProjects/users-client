import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootCreationComponent } from './root-creation.component';

describe('RootCreationComponent', () => {
  let component: RootCreationComponent;
  let fixture: ComponentFixture<RootCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
