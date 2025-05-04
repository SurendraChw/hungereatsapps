import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
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

  constructor(private firestore: AngularFirestore, private router: Router, public commonService: CommonserviceService,
    private platform: Platform, private loadingCtrl: LoadingController
  ) {}
  
  // Initialize the component
  ngOnInit() {
    console.log('Firestore:', this.firestore)
    //this.loadOrders();
  }

  async loadOrders() {
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

    
    debugger
    const loader = await this.showLoader(); // Display loader
    const db = getFirestore(); // Initialize Firestore
    let q;
    const usersRef = collection(db, 'orders');
    console.log('this.commonService.adminRole:', this.commonService.adminRole);
    console.log('this.commonService.userRole:', this.commonService.userRole);

    try {
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
      console.log('snapshot.empty:', snapshot.empty);
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
        this.orders = this.orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        console.log('Fetched orders:', this.orders);
      } else {
        this.commonService.showToast("No Data Found");
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      this.commonService.showToast("No Data Found");
    }
    this.hideLoader(loader);
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
  goToOrderDetail(order: string) {
    console.log('Navigating to order details for order ID:', order);
    this.router.navigate(['/orderhistorydetails'], { state: { order } });
  }

  //Show loader
  async showLoader() {
    const isIOS = this.platform.is('ios');
    const loader = await this.loadingCtrl.create({
      message: '',
      cssClass: isIOS ? '' : 'custom-spinner',
    });
    await loader.present();
    return loader;
  }

  //Hide loader
  async hideLoader(loader: HTMLIonLoadingElement) {
    if (loader) {
      await loader.dismiss();
    }
  }

}
