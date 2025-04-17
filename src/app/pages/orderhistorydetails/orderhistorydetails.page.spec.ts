import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderhistorydetailsPage } from './orderhistorydetails.page';

describe('OrderhistorydetailsPage', () => {
  let component: OrderhistorydetailsPage;
  let fixture: ComponentFixture<OrderhistorydetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderhistorydetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
