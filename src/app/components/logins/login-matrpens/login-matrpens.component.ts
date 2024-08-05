import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-matrpens',
  templateUrl: './login-matrpens.component.html',
  styleUrls: ['./login-matrpens.component.css']
})
export class LoginMatrpensComponent {
  username: string = '';
  password: string = '';
  recoveryEmail: string = '';
  message: string = '';
  recoveryMessage: string = '';
  showRecoveryForm: boolean = false;

  constructor(private router: Router) {}

  checkLogin() {
    if (this.username === 'AdminMatricula' && this.password === '12345') {
      this.router.navigate(['/dashboard-matricula-pensiones']);
    } else {
      this.message = 'Invalid username or password';
    }
  }

  showRecoveryMatriculaPensionForm() {
    this.showRecoveryForm = true;
  }

  showMatriculaPensionForm() {
    this.showRecoveryForm = false;
  }

  requestPasswordRecovery() {
    // Simulate password recovery process
    this.recoveryMessage = 'Recovery email has been sent';
  }
}
