import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  userLoggedIn: boolean
  constructor(public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(e => e === null ? this.userLoggedIn = false: this.userLoggedIn = true)
  }
  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  ngOnInit() { }
}
