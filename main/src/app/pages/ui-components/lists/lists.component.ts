import { Component, OnInit } from '@angular/core';
import { UserService } from './userService';
import { UserDto } from './userDto';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class AppListsComponent implements OnInit {
  clients: UserDto[] = [];
  prestataires: UserDto[] = [];
  displayedColumns: string[] = ['id', 'userName', 'email', 'roleUser', 'actions'];
  isAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkTokenExpiration();
    this.checkAdminRole();
    // this.fetchClients();
    // this.fetchPrestataires();
  }

  checkTokenExpiration() {
    const tokenExpiration = localStorage.getItem('authToken');

    if (tokenExpiration) {
      const expirationDate = new Date(tokenExpiration);
      const currentDate = new Date();

      if (currentDate >= expirationDate) {
        alert('Session expired. Please log in again.');
        this.router.navigate(['/authentication/login']);
      }
    } else {
      alert('No session found. Please log in.');
      this.router.navigate(['/authentication/login']);
    }
  }

  checkAdminRole() {
    const userRole = localStorage.getItem('userRole');
    const adminId = localStorage.getItem('userId'); // Get admin ID from localStorage

    if (userRole === 'Admin' && adminId) {
      this.isAdmin = true;
      this.fetchClients(adminId);
      this.fetchPrestataires(adminId);
    } else {
      alert('Access denied. Only administrators can view this page.');
      this.router.navigate(['/dashboard']);
    }
  }

  fetchClients(adminId: string) {
    this.userService.fetchClients(adminId).subscribe((data) => {
      this.clients = data;
    }, error => {
      console.error("Failed to fetch clients:", error);
    });
  }

  fetchPrestataires(adminId: string) {
    this.userService.fetchPrestataires(adminId).subscribe((data) => {
      this.prestataires = data;
    }, error => {
      console.error("Failed to fetch prestataires:", error);
    });
  }
  addUser(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("User data to be added:", result);  // Log the result to confirm it contains the correct data
        this.userService.addUser(result).subscribe(() => {
          const adminId = localStorage.getItem('userId')
          this.fetchClients(adminId!);
          this.fetchPrestataires(adminId!);
        }, error => {
          console.error("Failed to add user:", error);  // Log errors if any
        });
      } else {
        console.log("Dialog was closed without saving.");
      }
    });
  }

  editUser(user: UserDto): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser({ ...user, ...result }).subscribe(() => {
          const adminId = localStorage.getItem('userId')
          this.fetchClients(adminId!);
          this.fetchPrestataires(adminId!);
        });
      }
    });
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(() => {
      const adminId = localStorage.getItem('userId')
          this.fetchClients(adminId!);
          this.fetchPrestataires(adminId!);
    });
  }
}
