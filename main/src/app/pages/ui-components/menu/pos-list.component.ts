import { Component, OnInit } from '@angular/core';
import { PosService } from '../../dashboard/services/PosService';
import { POSWithDetails } from '../../dashboard/models/PosWithDetails';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pos-list',
  templateUrl: './pos-list.component.html',
  styleUrl: './pos-list.component.css',
})
export class PosListComponent implements OnInit {
  posList: POSWithDetails[] = [];
  adminId: string | null = '';

  constructor(private posService: PosService, private router: Router) {}

  ngOnInit(): void {
    this.adminId = localStorage.getItem('userId');  // Get the logged-in admin ID
    if (this.adminId) {
      this.fetchPOSByAdmin(this.adminId);
    }
  }

  fetchPOSByAdmin(adminId: string): void {
    this.posService.getPOSByAdminId(adminId).subscribe(
      (data: POSWithDetails[]) => {
        this.posList = data;
      },
      (error) => {
        console.error('Error fetching POS:', error);
      }
    );
  }

  onPosClick(pos: POSWithDetails): void {
    console.log('POS clicked:', pos);
    this.router.navigate([`/ui-components/pos/${pos.posId}`]);
  }
}
