import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AlertController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { CommonserviceService } from './services/commonservice.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Platform } from '@ionic/angular';
import { firstValueFrom } from 'rxjs'; // Add this import at the top
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Network } from '@ionic-native/network/ngx';
import { IonRouterOutlet, LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  /* get a reference to the used IonRouterOutlet 
  assuming this code is placed in the component
  that hosts the main router outlet, probably app.components */
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet!: IonRouterOutlet;

  version: any;
  constructor(private router: Router, private auth: AuthService, private menuCtrl: MenuController, private storage: Storage, private appVersionService: AppVersion,
    private commonService: CommonserviceService, private alertCtrl: AlertController,  private firestore: AngularFirestore, private platform: Platform, 
    private network: Network) {
    
  }

  //Method for initializing the app
  async initializeapp() {
    debugger
    await this.storage.create();
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

  ngOnInit() {
    this.platform.ready().then(() => {
      debugger
      console.log("Network type is::::::", this.network.type);
      this.platform.backButton.subscribeWithPriority(9999, (processNextHandler) => {
        console.log('Back button blocked');
        // Not calling processNextHandler() prevents bubbling.
      });
      //this.checkAndSeedMenus();
      //this.commonService.seedMenusAndUsers();
      this.appVersionService.getVersionNumber().then(version => {
        this.commonService.appVersion = version;
        this.version = version;
        console.log('App Version:', this.commonService.appVersion);
      }).catch(() => {
        this.commonService.appVersion = '0.0.1'; // fallback
        this.version = '0.0.1';
        console.log('catch App Version:', this.commonService.appVersion);
      });

      debugger
      // 
      if (this.isnetworkConnected()) {
        console.log('Internet Connected');
        this.initializeapp();
      } else {
        console.log('Internet Not Connected');
        //this.router.navigate(['/nointernet']);
        this.router.navigateByUrl('/nointernet');
      }

      // Checking Network Connection
      this.initializeNetworkEvents();
    });

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
            this.router.navigateByUrl('/');
          }
        }
      ]
    });
    (await alert).present();
  }

  /* BOOTS a listener on the network */
  public initializeNetworkEvents(): void {
    /* OFFLINE */
    debugger
    this.network.onDisconnect().subscribe(() => {
      console.log('Connection Lost');
      this.router.navigate(['/nointernet']);
    })
    /* ONLINE */
    this.network.onConnect().subscribe(() => {
      console.log('Connection got ');
      // Hiding loader if network is connected
      // this.apiCall.hideLoding();
    })
  }

  // Checking network connected or not
  isnetworkConnected(): boolean {
    debugger
    const conntype = this.network.type;
    console.log('conntype ', conntype);
    // if we are testing in mobile device, enable below line and comment another return statement.
    // return conntype && conntype !== 'unknown' && conntype !== 'none';

    // if we are testing in chrome device, enable below line and comment above line
    return conntype !== 'none' && conntype !== 'unknown';
  }

}
