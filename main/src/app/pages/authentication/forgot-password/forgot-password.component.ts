import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
        console.log('Form is valid:', this.forgotPasswordForm.value);
        this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe(
            response => {
                alert(response);  // This will display the plain text response
            },
            error => {
                console.error('Forgot password failed', error);
                alert('Failed to send password reset link. Please try again.');
            }
        );
    } else {
        console.log('Form is invalid');
    }
}

}
