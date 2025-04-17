import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orderhistorydetails',
  templateUrl: './orderhistorydetails.page.html',
  styleUrls: ['./orderhistorydetails.page.scss'],
  standalone: false,
})
export class OrderhistorydetailsPage implements OnInit {

  orderItems: any[] = [];
  totalWithQuantity: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private firestore: AngularFirestore) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { orderId: string };
    if (state?.orderId) {
      this.loadOrderDetails(state.orderId);
    }
  }

  ngOnInit() {
  }

  loadOrderDetails(orderId: string) {
    this.firestore.collection('ordertransactions', ref => ref.where('orderId', '==', orderId))
      .valueChanges()
      .subscribe(data => {
        this.orderItems = data;
        console.log('Fetched order items:', this.orderItems);
        // To sum price * quantity (for total order amount):
        this.totalWithQuantity = this.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        console.log('Total Price (with quantity):', this.totalWithQuantity);
      });
  }
}
