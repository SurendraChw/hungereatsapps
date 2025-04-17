import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { CommonserviceService } from 'src/app/services/commonservice.service';

@Component({
  selector: 'app-orderhistory',
  templateUrl: './orderhistory.page.html',
  styleUrls: ['./orderhistory.page.scss'],
  standalone: false,
})
export class OrderhistoryPage implements OnInit {
  orders: any[] = [];

  constructor(private firestore: AngularFirestore, private router: Router, public commonService: CommonserviceService) {}
  
  // Initialize the component
  ngOnInit() {
    console.log('Firestore:', this.firestore)
    //this.loadOrders();
  }

  async loadOrders() {
    debugger
    // fetch all orders from orders collection
    // const snapshot = await this.firestore.firestore.collection('orders').get();
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


    const db = getFirestore(); // Initialize Firestore
    let q;
    const usersRef = collection(db, 'orders');
    console.log('this.commonService.adminRole:', this.commonService.adminRole);
    console.log('this.commonService.userRole:', this.commonService.userRole);

    if (this.commonService.adminRole === this.commonService.userRole) {
      console.log('if:');
      // Admin: fetch all records
      q = query(usersRef);
    } else {
      // Non-admin: fetch only their own orders
      q = query(usersRef, where('createdby', '==', this.commonService.userId));
    }
    console.log('q:', q);

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      this.orders = snapshot.docs.map(doc => {
        const data = doc.data() as { [key: string]: any };
        const id = doc.id;
        return { id, ...data };
      });
      this.orders = this.orders.map(order => ({
        ...order,
        date: new Date(order.date.seconds * 1000 + order.date.nanoseconds / 1000000)
      }));
      // Sort orders by date descending (latest first)
      this.orders.sort((a, b) => b.date.getTime() - a.date.getTime());
      console.log('Fetched orders:', this.orders);
    } else {
      this.commonService.showToast("No Data Found");
    }

    

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
