import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantDataComponent } from './merchant-data.component';

describe('MerchantDataComponent', () => {
  let component: MerchantDataComponent;
  let fixture: ComponentFixture<MerchantDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
