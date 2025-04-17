import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AlertController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { CommonserviceService } from './services/commonservice.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private router: Router, private auth: AuthService, private menuCtrl: MenuController, private storage: Storage, 
    private commonService: CommonserviceService, private alertCtrl: AlertController) {
    
    this.initializeapp();
  }

  //Method for initializing the app
  async initializeapp() {
    await this.storage.create();
    // Check if user is logged in
    this.storage.get('loginInfo').then((val) => {
      console.log('loginInfo:', val);
      if (val == null || val == undefined || val == "") {
        this.router.navigate(['/login']);
      } else {
        const loginInfo = JSON.parse(val);
        console.log('loginInfo name:', loginInfo.name);
        this.commonService.userRole = loginInfo.role;
        console.log('AppComponent userRole:', this.commonService.userRole);
        this.storage.get('loginUserId').then((userId) => {
          this.commonService.userId = userId;
          console.log('AppComponent userId:', this.commonService.userId);
        })
        this.router.navigate(['/home']);
      }  
    })
  }

  // Function to open the menu
  closeMenu() {
    this.menuCtrl.close();
  }

  // Function to navigate to the home page
  navigateToHome() {
    this.menuCtrl.close();
    this.router.navigateByUrl('/home');
  }
  
  // Function to navigate to the order history page
  navigateToOrderHistory() {
    this.menuCtrl.close();
    this.router.navigateByUrl('/orderhistory');
  }

  // Logout function to clear session and redirect to login page
  async logout() {
    // this.auth.logout().then(() => {
    //   this.commonService.setLocalStorageByKeyValue('loginInfo', "");
    //   this.menuCtrl.close();
    //   this.router.navigateByUrl('/');
    // });
    this.menuCtrl.close();
    let alert = this.alertCtrl.create({
      message: "Are you sure want to Logout ?",
      cssClass: 'custom_alert_class',
      buttons: [
        {
          text: "No",
          role: 'NO',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: "Yes",
          handler: () => {
            this.storage.clear().then(() => {
              console.log('all keys cleared');
            });
            this.commonService.allLocalStorage = {};
            this.commonService.setLocalStorageByKeyValue('loginInfo', "");
            this.commonService.setLocalStorageByKeyValue('loginUserId', "");
            this.router.navigateByUrl('/');
          }
        }
      ]
    });
    (await alert).present();
  }
}
