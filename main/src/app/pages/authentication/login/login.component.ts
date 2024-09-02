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

        localStorage.setItem('authToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('userRole', response.userRole);
        localStorage.setItem('userId', response.userId);

        this.router.navigate(['/dashboard']).then(() => {
          // Vérifiez si la redirection a réussi
          console.log('Redirection to /dashboard successful');
        }).catch(error => {
          // Affichez l'erreur en cas de problème avec la redirection
          console.error('Redirection failed', error);
        });
      }, error => {
        console.error('Login failed', error);
      });
    }
  }
}
