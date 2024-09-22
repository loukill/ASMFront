import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.css'
})
export class AppSideLoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

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

        // Stockage des tokens et informations utilisateur
        localStorage.setItem('authToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('userRole', response.userRole);
        localStorage.setItem('userId', response.userId);

        // Redirection vers le tableau de bord
        this.router.navigate(['/dashboard']).then(() => {
          console.log('Redirection to /dashboard successful');
        }).catch(error => {
          console.error('Redirection failed', error);
        });
      }, error => {
        console.error('Login failed', error);
        this.loginError = 'Invalid username or password. Please try again.'; // Gestion de l'erreur
      });
    }
  }
}
