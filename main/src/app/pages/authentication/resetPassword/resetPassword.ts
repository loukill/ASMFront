import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | undefined;
  email: string | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  passwordMatchValidator(frm: FormGroup) {
    const password = frm.get('password');
    const confirmPassword = frm.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const resetPasswordDto = {
      token: this.token,
      email: this.email,
      password: this.resetPasswordForm.get('password')?.value
    };

    this.authService.resetPassword(resetPasswordDto).subscribe(
      response => {
        alert('Password has been reset successfully.');
        this.router.navigate(['/authentication/login']);
      },
      error => {
        console.error('Error resetting password', error);
        alert('Error resetting password: ' + (error.error?.errors?.Email || 'Unknown error'));
      }
    );
  }
}
