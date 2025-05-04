import { Component, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { IonModal, LoadingController, Platform } from '@ionic/angular';
import { collection, doc, getDocs, getFirestore, query, runTransaction, where } from 'firebase/firestore';
import { AuthService } from '../services/auth.service';
import { CommonserviceService } from '../services/commonservice.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  // Define the items available for order
  // Each item has a name, description, price, and quantity
  // items = [
  //   { name: 'Pizza', description: 'Cheesy goodness', price: 250, quantity: 0 },
  //   { name: 'Burger', description: 'Grilled beef with cheese', price: 180, quantity: 0 },
  //   { name: 'Pasta', description: 'Creamy Alfredo sauce', price: 220, quantity: 0 },
  //   { name: 'Cold Drink', description: 'Chilled soft drink', price: 50, quantity: 0 },
  // ];
  menus: any[] = [];
  items: any[] = [];
  groupedItems: any[] = [];
  orderType = 'Walkin';
  isPhoneOrder: boolean = false;

  selectedItem: any = null;
  showPopup: boolean = false;
  
  orderItems: any[] = [];
  total: number = 0;
  orderStatus: string = 'Normal';

  totalPrice: number = 0;
  // menuColors: { [key: string]: string } = {
  //   'WRAPS': '#FFC107',
  //   'RICE BOWLS': '#4CAF50',
  //   'SANDWICHES': '#03A9F4',
  //   'BURGERS': '#FF5722',
  //   'STREET BITES': '#9C27B0',
  //   'SIDES': '#009688',
  //   'HOT BEVERAGES': '#FF9800',
  //   'HEALTHY SMOOTHIE BLENDS': '#8BC34A'
  // };

  menuColors: { [key: string]: string } = {
    'WRAPS': '#FF6F61',            // Soft red-orange
    'RICE BOWLS': '#66BB6A',        // Fresh green
    'SANDWICHES': '#42A5F5',        // Bright blue
    'BURGERS': '#FF7043',           // Vibrant orange
    'STREET BITES': '#AB47BC',      // Vivid purple
    'SIDES': '#26C6DA',             // Cool teal
    'HOT BEVERAGES': '#FFA726',     // Warm orange
    'HEALTHY SMOOTHIE BLENDS': '#7CB342' // Fresh lime green
  };
  selectedItems: any[] = [];
  summaryLines: string[] = [];
  showPaymentOptions = false;
  paymentType: 'Cash' | 'Card' = 'Cash';
  @ViewChild('paymentModal', { static: false }) paymentModal: IonModal | undefined;

  getMenuColor(menuName: string): string {
    return this.menuColors[menuName] || '#E0E0E0';
  }

  // Injecting Router and AuthService for navigation and authentication
  constructor(private router: Router, private auth: AuthService, private firestore: AngularFirestore, public commonService: CommonserviceService, 
    private platform: Platform, private loadingCtrl: LoadingController) {}

  // Initialize item quantities to zero when the component is created
  ngOnInit() {
    this.items.forEach(item => item.quantity = 0);
    this.getMenuItemsData();
  }

  // Reset quantities when the view is about to enter
  ionViewWillEnter() {
    this.items.forEach(item => item.quantity = 0);
    this.showPopup = false;
  }

  async getMenuItemsData() {
    const loader = await this.showLoader(); // Display loader
    
    const db = getFirestore(); // Initialize Firestore

    const usersRef1 = collection(db, 'menus');
    const q1 = query(usersRef1,
      where('status', '==', '1')
    );
    const snapshot1 = await getDocs(q1);
    this.menus = snapshot1.docs.map(doc => {
      const data = doc.data() as { [key: string]: any };
      const id = doc.id;
      return { id, ...data };
    });
    console.log('menus details:', this.menus);

    const usersRef = collection(db, 'items');
    const q = query(usersRef,
      where('status', '==', '1')
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      console.log('items details:', snapshot.docs[0].data());
      this.items = snapshot.docs.map(doc => {
        const data = doc.data() as { [key: string]: any };
        const id = doc.id;
        return { id, ...data };
      });
      console.log("items:::", this.items);


      this.groupedItems = this.menus.map(menu => ({
        ...menu,
        items: this.items.filter(item => item.menuid === menu.id)
      }));
      console.log("groupedItems:::", this.groupedItems);

    } else {
      this.commonService.showToast("No Data Found");
    }
    this.hideLoader(loader);
    // const snapshot = await this.firestore.firestore.collection('items').get();
    // snapshot.forEach(doc => {
    //   console.log(doc.id, '=>', doc.data());
    // });
  }

  // Calculate total price based on item quantities
  // get totalPrice(): number {
  //   return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // }

  // Calculate total quantity of items
  // increment(item: any) {
  //   item.quantity++;
  // }

  // Decrement item quantity, ensuring it doesn't go below zero
  // decrement(item: any) {
  //   if (item.quantity > 0) item.quantity--;
  // }

  // Check if any item has been selected
  isOrderValid(): boolean {
    return this.items.some(item => item.quantity > 0);
  }

  // Update order type based on toggle switch
  updateOrderType(event: any) {
    this.orderType = event.detail.checked ? 'Phone' : 'Walkin';
  }

  // Open the popup for item details
  openItemDetails(item: any) {
    this.selectedItem = item;
    this.showPopup = true;
  }
  
  // Close the popup for item details
  closePopup() {
    this.showPopup = false;
  }

  // Navigate to order details page with selected items and total price
  confirmOrder() {
    if (!this.isOrderValid()) {
      // alert('Please select at least one item.');
      this.commonService.showToast("Please select at least one item.");
      return;
    }
    const selectedItems = this.items.filter(item => item.quantity > 0);
    
    this.router.navigate(['/orderdetails'], {
      state: {
        order: selectedItems,
        total: this.totalPrice,
        status: this.orderType
      }
    });
  }

  selectItem(item: any) {
    const existing = this.selectedItems.find(i => i.id === item.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.selectedItems.push({ ...item, quantity: 1, notes: '' });
    }
    console.log('Selected items:', this.selectedItems);
    this.calculateTotal();
  }
  
  getSelectedQuantity(itemId: string) {
    const item = this.selectedItems.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  }

  increment(item: any) {
    item.quantity++;
    this.calculateTotal();
  }
  
  decrement(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeItem(item);
    }
    this.calculateTotal();
  }
  
  removeItem(item: any) {
    this.selectedItems = this.selectedItems.filter(i => i.id !== item.id);
    this.calculateTotal();
  }
  
  calculateTotal() {
    this.totalPrice = this.selectedItems.reduce((sum, item) => {
      const price = parseFloat(item.price);
      return sum + (item.quantity * price);
    }, 0);
  
    this.generateSummaryLines();
  }

  generateSummaryLines() {
    this.summaryLines = [];

    this.summaryLines.push(`Sub Total: ₹${this.totalPrice}`);
    this.summaryLines.push(`Discount: ₹0`);
    this.summaryLines.push(`VAT - 2.5%: ₹${(this.totalPrice * 0.025).toFixed(2)}`);

    this.selectedItems.forEach(item => {
      if (item.name.toLowerCase().includes('sambar')) {
        this.summaryLines.push(`% Added for ${item.name} : NaN`);
      } else if (item.name.toLowerCase().includes('masala')) {
        this.summaryLines.push(`SGST % Added for ${item.name} : 5.00`);
      } else {
        this.summaryLines.push(`SGST % Added for ${item.name} : 1.75`);
      }
    });
  }

  // Reset all item quantities to zero
  resetOrder() {
    this.items.forEach(item => item.quantity = 0);
  }

  // Logout function to clear session and redirect to login page
  logout() {
    this.auth.logout().then(() => {
      this.router.navigateByUrl('/');
    });
  }

  async openPaymentModal() {
    if (this.paymentModal) {
      await this.paymentModal.present();
    }
  }
  
  async closePaymentModal() {
    if (this.paymentModal) {
      await this.paymentModal.dismiss();
    }
  }

  confirmPayment() {
    console.log('Selected Payment Type:', this.paymentType);
    this.showPaymentOptions = false;
    // Proceed with final order placement
    this.placeOrder(); // or your own logic
  }

  // Function to navigate back to home page
  async placeOrder() {
    const loader = await this.showLoader(); // Display loader
    try {
      console.log('Placing order...');
      const counterRef = doc(this.firestore.firestore, 'counters', 'orders');

      const newOrderId = await runTransaction(this.firestore.firestore, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);

        // If the counter document does not exist, create it with lastOrderNumber set to 0
        if (!counterDoc.exists()) {
          console.log('Counter document does not exist. Creating a new one.');
          transaction.set(counterRef, { lastOrderNumber: 0 }); // Create the document
        }

        const lastOrderNumber = counterDoc.exists() ? counterDoc.data()['lastOrderNumber'] : 0;
        const newOrderNumber = lastOrderNumber + 1;

        // Update the counter with the new order number
        transaction.update(counterRef, { lastOrderNumber: newOrderNumber });

        return newOrderNumber;
      });

      const orderRef = await this.firestore.firestore.collection('orders').add({
        orderId: newOrderId, // <-- custom order ID
        status: this.orderType === "Phone" ? 'Running' : 'Success',
        date: new Date(),
        total: this.totalPrice,
        ordertype: this.orderType,
        paymenttype: this.paymentType,
        createdby: this.commonService.userId,
      });

      // const orderId = orderRef.id;
      console.log('Order ID:', newOrderId);

      const batch = this.firestore.firestore.batch();
      console.log('selectedItems:', this.selectedItems);

      this.selectedItems.forEach(item => {
        const txnRef = this.firestore.firestore.collection('ordertransactions').doc();
        console.log('Adding transaction for:', item.name);
        console.log('item Order ID:', newOrderId);
        batch.set(txnRef, {
          orderId: newOrderId,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes,
        });
      });

      await batch.commit();

      console.log('Order and transactions committed.');
      //alert('Order placed successfully!');
      this.commonService.showToast("Order placed successfully");
      //this.router.navigateByUrl('/home');

      this.totalPrice = 0;
      this.selectedItems = [];

    } catch (error) {
      console.error('Error placing order:', error);
      //alert('Failed to place order. Please try again.');
      this.commonService.showToast("Failed to place order. Please try again.");
    }
    
    if (this.paymentModal) {
      await this.paymentModal.dismiss();
    }
    this.orderType = 'Walkin';
    this.paymentType = 'Cash';
    this.isPhoneOrder = false;
    this.hideLoader(loader);
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
