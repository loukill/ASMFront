import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RegisterDto } from './registerDto';
import { PosService } from '../../dashboard/services/PosService';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.css']
})
export class AppSideRegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  roles: string[] = ['Admin', 'Client'];
  posOptions: any[] = []; // Array to store POS options
  registrationError: string | null = null;
  registrationSuccess: string | null = null;
  validationStatusSubscription: Subscription | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private posService: PosService // Inject the POS service
  ) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required, Validators.minLength(3)],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), passwordPatternValidator()]],
      roleUser: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      posName: [{ value: '', disabled: true }],
      posLocation: [{ value: '', disabled: true }],
      posImage: [{ value: '', disabled: true }],
      posId: [{ value: '', disabled: true }] // Add a new field for POS selection
    });

    function passwordPatternValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value || '';

        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumeric = /[0-9]/.test(value);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSymbol;

        return !passwordValid ? {
          hasUpperCase: !hasUpperCase,
          hasLowerCase: !hasLowerCase,
          hasNumeric: !hasNumeric,
          hasSymbol: !hasSymbol,
        } : null;
      };
    }

    this.registerForm.get('roleUser')?.valueChanges.subscribe(role => {
      if (role === 'Admin') {
        this.enableAdminFields();
      }else {
        this.disableAllPosFields();
      }
    });
  }

  ngOnInit(): void {
    this.fetchPosOptions();
  }

  ngOnDestroy(): void {
    if (this.validationStatusSubscription) {
      this.validationStatusSubscription.unsubscribe();
    }
  }

  enableAdminFields() {
    this.registerForm.get('posName')?.enable();
    this.registerForm.get('posLocation')?.enable();
    this.registerForm.get('posImage')?.enable();
    this.registerForm.get('posId')?.disable();
  }

  // enablePrestataireFields() {
  //   this.registerForm.get('posId')?.enable();
  //   this.registerForm.get('posName')?.enable();
  //   this.registerForm.get('posLocation')?.disable();
  //   this.registerForm.get('posImage')?.disable();
  // }

  disableAllPosFields() {
    this.registerForm.get('posName')?.disable();
    this.registerForm.get('posLocation')?.disable();
    this.registerForm.get('posImage')?.disable();
    this.registerForm.get('posId')?.disable();
  }

  fetchPosOptions() {
    this.posService.getPosList().subscribe(
      (posList) => {
        this.posOptions = posList;
        console.log('POS options loaded:', this.posOptions); // Debugging line
      },
      (error) => {
        console.error('Failed to load POS options', error);
      }
    );
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  register() {
    if (this.registerForm.valid) {
      const formData = new FormData();
      formData.append('userName', this.registerForm.get('userName')?.value);
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      formData.append('roleUser', this.registerForm.get('roleUser')?.value);
      formData.append('phoneNumber', this.registerForm.get('phoneNumber')?.value);

      // if (this.registerForm.get('roleUser')?.value === 'Admin') {
      //   formData.append('posName', this.registerForm.get('posName')?.value);
      //   formData.append('posLocation', this.registerForm.get('posLocation')?.value);
      //   if (this.selectedFile) {
      //     formData.append('posImage', this.selectedFile, this.selectedFile.name);
      //   }
      // }
      this.authService.register(formData).subscribe(response => {
        console.log('Registration successful', response);
        this.registrationSuccess = 'Registration successful! Your account is pending approval from the admin.';
        this.registrationError = null;

        const userId = response.userId;
        this.pollValidationStatus(userId);
      }, error => {
        console.error('Registration failed', error);
        this.registrationError = 'Registration failed. Please try again.';
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
