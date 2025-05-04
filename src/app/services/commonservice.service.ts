import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Platform } from '@ionic/angular';
import { firstValueFrom } from 'rxjs'; // Add this import at the top

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {

  allLocalStorage: any = {};
  userRole: any;
  userId: any;
  appVersion: any;
  
  adminRole: any = '1'; //Admin Role
  managerRole: any = '2'; //Manager Role
  employeeRole: any = '3'; //Employee Role

  constructor(private storage: Storage, private toastCtrl: ToastController,  private firestore: AngularFirestore) { }

  //Set Local Storage Values by Common Method
  async setLocalStorageByKeyValue(key: string, value: string) {
    await this.storage.create();//To fix the localstorage issue
    this.storage.set(key, value);
    this.allLocalStorage[key] = value;
  }

  //Get Local Storage Values by Common Method
  async getLocalStorageByKey(Key: string) {
    await this.storage.create();//To fix the localstorage issue
    if (this.allLocalStorage.hasOwnProperty(Key)) {
      return this.allLocalStorage[Key];
    } else {
      return null;
    }
  }

  //Method for displaying toast message
  async showToast(msg: any) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      cssClass: 'custom-toast-class'
    });
    toast.onDidDismiss();
    toast.present();
  }

  async seedMenusAndUsers() {
    const isSeeded = localStorage.getItem('menusSeeded');
    if (isSeeded) return;

    try {
      const snapshot = await firstValueFrom(this.firestore.collection('users').get());
      if (!snapshot.empty) {
        localStorage.setItem('menusSeeded', 'true');
        return;
      }

      const usersData = [
        {
          id: '2',
          name: 'Surendra',
          email: 'surendra.c60@gmail.com',
          mobileno: '9035100109',
          password: 'Test@123',
          role: '1',
          status: '1'
        }
      ];

      const batch = this.firestore.firestore.batch();

      usersData.forEach(user => {
        const docRef = this.firestore.firestore.collection('users').doc();
        batch.set(docRef, user);
      });


      await batch.commit();
      localStorage.setItem('menusSeeded', 'true');
      console.log('Users and Menus collection seeded.');
    } catch (error) {
      console.error('Seeding error:', error);
    }
  }


}
