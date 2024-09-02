import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/pages/authentication/services/userService';
import { AuthService } from 'src/app/pages/authentication/services/authService';
import { UserDto } from '../authentication/models/userDto';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user!: UserDto;
  loading: boolean = false; // Add loading state
  errorMessage: string = ''; // Add error message for displaying errors

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<UserProfileComponent>
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.getUserDetails(userId);
    } else {
      console.error('No user ID found in localStorage');
      this.errorMessage = 'User ID is missing';
    }
  }

  getUserDetails(userId: string): void {
    this.loading = true; // Start loading
    this.userService.getUserById(userId).subscribe(
      (user) => {
        this.user = user;
        this.loading = false; // Stop loading
      },
      (error) => {
        console.error('Error fetching user details:', error);
        this.loading = false; // Stop loading
        this.errorMessage = 'Failed to fetch user details.';
      }
    );
  }

  onSubmit() {
    if (this.user) {
      this.userService.updateUser(this.user).subscribe(
        response => {
          console.log('Update successful', response);
        },
        error => {
          console.error('Error updating user:', error);
          this.errorMessage = 'Failed to update user.';
        }
      );
    } else {
      console.error('No user data available for update');
      this.errorMessage = 'No user data available for update.';
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
