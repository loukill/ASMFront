import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PosService } from 'src/app/pages/dashboard/services/PosService';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.css'
})
export class AddUserDialogComponent implements OnInit {
  userForm: FormGroup;
  roles: string[] = ['Admin', 'Client', 'Prestataire'];
  posList: any[] = []; // Store POS list

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private posService: PosService  // Inject the service to fetch POS
  ) {
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      roleUser: ['', Validators.required],
      posId: ['', Validators.required]  // Add posId control
    });
  }

  ngOnInit(): void {
    this.loadPOS();
  }

  // Fetch the list of POS from the backend
  loadPOS(): void {
    const adminId = localStorage.getItem('userId');

    if (adminId) {
      this.posService.getPOSByAdminId(adminId).subscribe(
        (data: any[]) => {
          this.posList = data;
        },
        (error) => {
          console.error('Error fetching POS by adminId:', error);
        }
      );
    } else {
      console.error('Admin ID not found in localStorage.');
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      console.log("Form data:", this.userForm.value);
      this.dialogRef.close(this.userForm.value);
    } else {
      console.error("Form is invalid!");
    }
  }
}
