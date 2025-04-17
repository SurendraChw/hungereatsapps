import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommonserviceService } from 'src/app/services/commonservice.service';

@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.page.html',
  styleUrls: ['./orderdetails.page.scss'],
  standalone: false,
})
export class OrderdetailsPage implements OnInit {
  orderItems: any[] = [];
  total: number = 0;
  orderStatus: string = 'Walkin';

  constructor(private router: Router, private firestore: AngularFirestore, public commonService: CommonserviceService) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { order: any[]; total: number; status: string };
    if (state) {
      this.orderItems = state.order;
      this.total = state.total;
      this.orderStatus = state?.status || 'Walkin';
    }
  }

  // Initialize the component
  ngOnInit() {
  }

  // Function to navigate back to home page
  async placeOrder() {
    try {
      console.log('Placing order...');
      const orderRef = await this.firestore.firestore.collection('orders').add({
        status: 'Success',
        date: new Date(),
        total: this.total,
        ordertype: this.orderStatus,
        createdby: this.commonService.userId,
      });

      const orderId = orderRef.id;
      console.log('Order ID:', orderId);

      const batch = this.firestore.firestore.batch();

      this.orderItems.forEach(item => {
        const txnRef = this.firestore.firestore.collection('ordertransactions').doc();
        console.log('Adding transaction for:', item.name);
        batch.set(txnRef, {
          orderId: orderId,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          price: item.price
        });
      });

      await batch.commit();

      console.log('Order and transactions committed.');
      //alert('Order placed successfully!');
      this.commonService.showToast("Order placed successfully");
      this.router.navigateByUrl('/home');
    } catch (error) {
      console.error('Error placing order:', error);
      //alert('Failed to place order. Please try again.');
      this.commonService.showToast("Failed to place order. Please try again.");
    }
  }

}
