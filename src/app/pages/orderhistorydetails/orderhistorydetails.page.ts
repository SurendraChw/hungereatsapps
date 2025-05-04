import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { CommonserviceService } from 'src/app/services/commonservice.service';
import { collection, doc, getDocs, getFirestore, query, runTransaction, where, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-orderhistorydetails',
  templateUrl: './orderhistorydetails.page.html',
  styleUrls: ['./orderhistorydetails.page.scss'],
  standalone: false,
})
export class OrderhistorydetailsPage implements OnInit {

  orderItems: any[] = [];
  totalWithQuantity: number = 0;
  orderId: any;
  ordertype: any;
  paymenttype: any;
  orderstatus: any;

  constructor(private router: Router, private route: ActivatedRoute, private firestore: AngularFirestore, private platform: Platform, 
    private loadingCtrl: LoadingController, public commonService: CommonserviceService) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { order: any };
    console.log('navigation state:', state);
    if (state?.order) {
      console.log('Order ID from navigation state:', state.order.orderId);
      // console.log('Order ID from navigation state:', state.order.orderId);
      this.orderId = state.order.orderId;
      this.ordertype = state.order.ordertype;
      this.paymenttype = state.order.paymenttype;
      this.orderstatus = state.order.status;
      this.loadOrderDetails(state.order.orderId);
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

  // async loadOrderDetails(orderId: string) {
  //   const loader = await this.showLoader();
  
  //   try {
  //     const data = await firstValueFrom(
  //       this.firestore.collection('ordertransactions', ref => ref.where('orderId', '==', orderId))
  //         .valueChanges()
  //     );
  
  //     this.orderItems = data;
  //     console.log('Fetched order items:', this.orderItems);
  
  //     this.totalWithQuantity = this.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  //     console.log('Total Price (with quantity):', this.totalWithQuantity);
  //   } catch (error) {
  //     console.error('Error fetching order details:', error);
  //   } finally {
  //     this.hideLoader(loader);
  //   }
  // }
  
  async updateOrderStatus(newStatus: 'Success' | 'Cancel') {
    const db = getFirestore();
  
    if (!this.orderId) return;
  
    try {
      const q = query(collection(db, 'orders'), where('orderId', '==', this.orderId));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        this.commonService.showToast('Order not found');
        return;
      }
  
      for (const docSnap of querySnapshot.docs) {
        await updateDoc(docSnap.ref, { status: newStatus });
      }
  
      this.commonService.showToast(`Order marked as ${newStatus}`);
      this.router.navigateByUrl('/orderhistory');
  
    } catch (error) {
      console.error('Error updating order status:', error);
      this.commonService.showToast('Failed to update order status');
    }
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
