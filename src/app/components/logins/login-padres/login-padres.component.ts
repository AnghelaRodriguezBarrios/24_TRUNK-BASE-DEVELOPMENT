import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-padres',
  templateUrl: './login-padres.component.html',
  styleUrls: ['./login-padres.component.css']
})
export class LoginPadresComponent {
  username: string = '';
  password: string = '';
  recoveryEmail: string = '';
  message: string = '';
  recoveryMessage: string = '';
  showRecoveryForm: boolean = false;

  constructor(private router: Router) {}

  checkLogin() {
    if (this.username === 'AdminPadres' && this.password === '12345') {
      this.router.navigate(['/dashboard-padres']);
    } else {
      this.message = 'Invalid username or password';
    }
  }

  showRecoveryPadresForm() {
    this.showRecoveryForm = true;
  }

  showPadresForm() {
    this.showRecoveryForm = false;
  }

  requestPasswordRecovery() {
    // Simulate password recovery process
    this.recoveryMessage = 'Recovery email has been sent';
  }
}
