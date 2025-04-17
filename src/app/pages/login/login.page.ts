import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonserviceService } from 'src/app/services/commonservice.service';
import { Observable } from 'rxjs';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  emailError = '';
  passwordError = '';

  constructor(private firestore: AngularFirestore, private auth: AuthService, private router: Router, public commonService: CommonserviceService,  ) {}

  ngOnInit() {
    debugger
    // this.auth.getUsers().subscribe(data => {
    //   console.log('Fetched users:', data);
    // });
  }

  // Function to validate email
  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailError = !emailRegex.test(this.email)
      ? 'Please enter a valid email.'
      : this.email === ''
      ? 'Email is required.'
      : '';
  }

  // Function to validate password
  validatePassword() {
    this.passwordError = this.password === ''
      ? 'Password is required.'
      : '';
  }

  // Function to handle login button click
  async login() {
    debugger
    this.validateEmail();
    this.validatePassword();
    console.log('Login clicked::', this.email, this.password);
    if (!this.emailError && !this.passwordError) {
      // this.auth.login(this.email, this.password).then(() => {
      //   const jsonObj: any = {};
      //   jsonObj.email = this.email;
      //   jsonObj.password = this.password;
      //   this.commonService.showToast("Logged In Successfully");
      //   this.commonService.setLocalStorageByKeyValue('loginInfo', jsonObj);
      //   this.router.navigateByUrl('/home');
      // }).catch(err => {
      //   this.commonService.showToast("Something went wrong. Please try again.");
      // });

      try {
        const db = getFirestore(); // Initialize Firestore

        const usersRef = collection(db, 'users');
        const q = query(usersRef,
          where('email', '==', this.email),
          where('password', '==', this.password),
          where('status', '==', '1')
        );
        
        try {
          const snapshot = await getDocs(q);
          // check if the snapshot is empty
          if (!snapshot.empty) {
            console.log('Login:', snapshot.docs[0]);
            console.log('Login details:', snapshot.docs[0].data());
            console.log('Login id:', snapshot.docs[0].id);
            const jsonObj: any = {};
            jsonObj.email = this.email;
            jsonObj.password = this.password;
            this.commonService.showToast("Logged In Successfully");
            this.commonService.setLocalStorageByKeyValue('loginInfo', JSON.stringify(snapshot.docs[0].data()));
            this.commonService.setLocalStorageByKeyValue('loginUserId', snapshot.docs[0].id);
            this.commonService.userRole = snapshot.docs[0].data()['role'];
            this.commonService.userId = snapshot.docs[0].id;
            console.log('userRole:', this.commonService.userRole);
            this.router.navigateByUrl('/home');
          } else {
            //alert('Invalid login');
            this.commonService.showToast("Invalid email or password.");
          }
        } catch (error) {
          console.error('Login error:', error);
          this.commonService.showToast("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error('Login error:', error);
        this.commonService.showToast("Something went wrong. Please try again.");
      }

      // this.firestore.collection('users', ref =>
      //   ref.where('email', '==', 'surendra.c60@gmail.com')
      //      .where('password', '==', 'Surendra@123')
      // ).get().subscribe({
      //   next: (snapshot) => {
      //     if (!snapshot.empty) {
      //       this.router.navigateByUrl('/home');
      //     } else {
      //       alert('Invalid login');
      //     }
      //   },
      //   error: (error) => {
      //     console.error('Login error:', error);
      //     alert('Something went wrong. Please try again.');
      //   }
      // });

    }
  }

}
