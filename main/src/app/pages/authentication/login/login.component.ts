import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(response => {
        console.log('Login successful', response);
        const userRole = this.authService.getUserRole();

        // Redirection basée sur le rôle utilisateur
        if (userRole === 'Admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (userRole === 'Prestataire') {
          this.router.navigate(['/prestataire-dashboard']);
        } else if (userRole === 'Client') {
          this.router.navigate(['/client-dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      }, error => {
        console.error('Login failed', error);
      });
    }
  }
}
