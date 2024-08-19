import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class AppSideRegisterComponent {
  registerForm: FormGroup;
  roles: string[] = ['Admin', 'Prestataire', 'Client'];
  registrationError: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roleUser: ['', Validators.required]
    });
  }

  register() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(response => {
        console.log('Registration successful', response);
        this.router.navigate(['/dashboard']);
      }, error => {
        console.error('Registration failed', error);
        this.registrationError = error; // Affichez l'erreur spécifique
      });
    } else {
      this.registrationError = 'Please fill out all required fields correctly.';
    }
  }
}
