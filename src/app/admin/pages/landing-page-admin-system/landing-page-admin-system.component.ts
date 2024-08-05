import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page-admin-system',
  templateUrl: './landing-page-admin-system.component.html',
  styleUrls: ['./landing-page-admin-system.component.css']
})
export class LandingPageAdminSystemComponent {
  username: string = ''
  password: string = ''
  message: string = ''

  constructor(private router: Router) {}

  checkLogin() { 
     if (this.username === 'Admin' && this.password === 'admin') {
      this.router.navigate(['/dashboard-notas']);
    } else {
      this.message = 'Invalid username or password';
    }
  }
}
