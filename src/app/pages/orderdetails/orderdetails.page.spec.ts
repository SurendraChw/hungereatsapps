import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderdetailsPage } from './orderdetails.page';

describe('OrderdetailsPage', () => {
  let component: OrderdetailsPage;
  let fixture: ComponentFixture<OrderdetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderdetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
