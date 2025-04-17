import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {

  allLocalStorage: any = {};
  userRole: any;

  constructor(private storage: Storage, private toastCtrl: ToastController) { }

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
}
