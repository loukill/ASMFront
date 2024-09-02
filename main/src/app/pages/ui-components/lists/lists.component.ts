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
    private dataService: UserService,
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

    if (userRole === 'Admin') {
      this.isAdmin = true;
      this.fetchClients();
      this.fetchPrestataires();
    } else {
      alert('Access denied. Only administrators can view this page.');
      this.router.navigate(['/dashboard']);
    }
  }

  fetchClients() {
    this.dataService.fetchClients().subscribe((data) => {
      this.clients = data;
    });
  }

  fetchPrestataires() {
    this.dataService.fetchPrestataires().subscribe((data) => {
      this.prestataires = data;
    });
  }

  addUser(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.addUser(result).subscribe(() => {
          this.fetchClients();
          this.fetchPrestataires();
        });
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
        this.dataService.updateUser({ ...user, ...result }).subscribe(() => {
          this.fetchClients();
          this.fetchPrestataires();
        });
      }
    });
  }

  deleteUser(userId: string): void {
    this.dataService.deleteUser(userId).subscribe(() => {
      this.fetchClients();
      this.fetchPrestataires();
    });
  }
}
