import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.css'
})
export class AppSideRegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  roles: string[] = ['Admin', 'Prestataire', 'Client'];
  registrationError: string | null = null;
  registrationSuccess: string | null = null;
  validationStatusSubscription: Subscription | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roleUser: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.validationStatusSubscription) {
      this.validationStatusSubscription.unsubscribe();
    }
  }

  register() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(response => {
        console.log('Registration successful', response);
        this.registrationSuccess = 'Registration successful! Your account is pending approval from the admin.';
        this.registrationError = null;

        // Start polling for validation status
        const userId = response.userId; // Ensure your backend returns the userId on successful registration
        this.pollValidationStatus(userId);
      }, error => {
        console.error('Registration failed', error);
        this.registrationError = 'Registration failed. Please try again later.';
        this.registrationSuccess = null;
      });
    } else {
      this.registrationError = 'Please fill out all required fields correctly.';
      this.registrationSuccess = null;
    }
  }

  private pollValidationStatus(userId: string) {
    this.validationStatusSubscription = interval(5000).pipe(
      switchMap(() => this.authService.checkValidationStatus(userId))
    ).subscribe(status => {
      if (status.IsValidated) {
        alert('Your account has been approved by the admin!');
        this.router.navigate(['/authentication/login']);
      }
    }, error => {
      console.error('Failed to check validation status', error);
    });
  }
}
