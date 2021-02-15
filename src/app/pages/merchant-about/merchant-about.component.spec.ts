import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantAboutComponent } from './merchant-about.component';

describe('MerchantAboutComponent', () => {
  let component: MerchantAboutComponent;
  let fixture: ComponentFixture<MerchantAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantAboutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
