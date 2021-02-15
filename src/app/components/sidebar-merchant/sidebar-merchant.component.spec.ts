import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarMerchantComponent } from './sidebar-merchant.component';

describe('SidebarMerchantComponent', () => {
  let component: SidebarMerchantComponent;
  let fixture: ComponentFixture<SidebarMerchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarMerchantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
