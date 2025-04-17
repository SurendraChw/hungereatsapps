import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
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
  orderType = 'Normal';
  isPhoneOrder: boolean = false;

  selectedItem: any = null;
  showPopup: boolean = false;

  // Injecting Router and AuthService for navigation and authentication
  constructor(private router: Router, private auth: AuthService, private firestore: AngularFirestore, public commonService: CommonserviceService) {}

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
    // const snapshot = await this.firestore.firestore.collection('items').get();
    // snapshot.forEach(doc => {
    //   console.log(doc.id, '=>', doc.data());
    // });
  }

  // Calculate total price based on item quantities
  get totalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Calculate total quantity of items
  increment(item: any) {
    item.quantity++;
  }

  // Decrement item quantity, ensuring it doesn't go below zero
  decrement(item: any) {
    if (item.quantity > 0) item.quantity--;
  }

  // Check if any item has been selected
  isOrderValid(): boolean {
    return this.items.some(item => item.quantity > 0);
  }

  // Update order type based on toggle switch
  updateOrderType(event: any) {
    this.orderType = event.detail.checked ? 'Phone' : 'Normal';
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


}
