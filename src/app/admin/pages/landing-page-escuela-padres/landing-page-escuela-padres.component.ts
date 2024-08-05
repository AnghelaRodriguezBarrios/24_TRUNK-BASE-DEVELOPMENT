import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page-escuela-padres',
  templateUrl: './landing-page-escuela-padres.component.html',
  styleUrls: ['./landing-page-escuela-padres.component.css']
})
export class LandingPageEscuelaPadresComponent {

  username: string = '';
  password: string = '';
  message: string = '';

  constructor(private router: Router) {}

  checkLogin() { 
    if (this.username === 'Admin' && this.password === 'admin') {
      this.router.navigate(['/dashboard-padres']);
    } else {
      this.message = 'Invalid username or password';
    }
  }

}

