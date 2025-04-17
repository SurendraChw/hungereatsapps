import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orderhistory',
  templateUrl: './orderhistory.page.html',
  styleUrls: ['./orderhistory.page.scss'],
  standalone: false,
})
export class OrderhistoryPage implements OnInit {
  orders: any[] = [];

  constructor(private firestore: AngularFirestore, private router: Router) {}
  
  // Initialize the component
  ngOnInit() {
    console.log('Firestore:', this.firestore)
    //this.loadOrders();
  }

  async loadOrders() {
    debugger
    const snapshot = await this.firestore.firestore.collection('orders').get();
    // snapshot.forEach(doc => {
    //   console.log(doc.id, '=>', doc.data());
    //   const data = doc.data() as any;
    //       const id = doc.id;
    //       return {
    //         id,
    //         ...data,
    //         date: data.date?.toDate() // Convert Firestore Timestamp to JS Date
    //       };
    // });

    this.orders = snapshot.docs.map(doc => {
      const data = doc.data() as { [key: string]: any };
      const id = doc.id;
      return { id, ...data };
    });
    this.orders = this.orders.map(order => ({
      ...order,
      date: new Date(order.date.seconds * 1000 + order.date.nanoseconds / 1000000)
    }));
    
    console.log('Fetched orders:', this.orders);

    // this.firestore.collection('orders', ref => ref.orderBy('date', 'desc'))
    //   .snapshotChanges()
    //   .subscribe(snapshot => {
    //     this.orders = snapshot.map(doc => {
    //       const data = doc.payload.doc.data() as any;
    //       const id = doc.payload.doc.id;
    //       return {
    //         id,
    //         ...data,
    //         date: data.date?.toDate() // Convert Firestore Timestamp to JS Date
    //       };
    //     });

    //     console.log('Fetched orders:', this.orders);
    //   }, error => {
    //     console.error('Error fetching orders:', error);
    //   });
  }

  ionViewWillEnter() {
    debugger
    this.loadOrders();
    // this.firestore.collection('orders', ref => ref.orderBy('date', 'desc')).snapshotChanges()
    //   .subscribe(snapshot => {
    //     this.orders = snapshot.map(doc => {
    //       const data = doc.payload.doc.data() as { [key: string]: any };
    //       const id = doc.payload.doc.id;
    //       return { id, ...data };
    //     });
    //   });
  }

  // Function to navigate to order details page
  goToOrderDetail(orderId: string) {
    this.router.navigate(['/orderhistorydetails'], { state: { orderId } });
  }


}
