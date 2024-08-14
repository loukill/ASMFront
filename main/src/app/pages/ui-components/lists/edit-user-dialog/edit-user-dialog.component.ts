import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.css'
})
export class EditUserDialogComponent {
  userForm: FormGroup;
  roles: string[] = ['Admin', 'Prestataire', 'Client'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      userName: [data.userName, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      roleUser: [data.roleUser, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
