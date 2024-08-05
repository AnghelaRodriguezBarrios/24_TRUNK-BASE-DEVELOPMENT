import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  username: string = '';
  password: string = '';
  recoveryEmail: string = '';
  message: string = '';
  recoveryMessage: string = '';
  showRecoveryForm: boolean = false;

  constructor(private router: Router) {}

  login() {
    if (this.username === 'Admin' && this.password === '12345') {
      this.router.navigate(['/dashboard-admin']);
    } else {
      this.message = 'Invalid username or password';
    }
  }

  showRecoveryAdminForm() {
    this.showRecoveryForm = true;
  }

  showAdminForm() {
    this.showRecoveryForm = false;
  }

  requestPasswordRecovery() {
    // Simulate password recovery process
    this.recoveryMessage = 'Recovery email has been sent';
  }
}
