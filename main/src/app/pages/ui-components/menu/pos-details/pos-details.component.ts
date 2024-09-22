import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PosService } from 'src/app/pages/dashboard/services/PosService';
import { POSWithDetails } from 'src/app/pages/dashboard/models/PosWithDetails';

@Component({
  selector: 'app-pos-details',
  templateUrl: './pos-details.component.html',
  styleUrls: ['./pos-details.component.css']
})
export class PosDetailsComponent implements OnInit {
  pos: POSWithDetails | null = null;
  posId: number | null = null;

  constructor(
    private posService: PosService,
    private route: ActivatedRoute,
    private router: Router // Inject Router to navigate after deletion
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.posId = +params.get('id')!;
      if (this.posId) {
        this.fetchPOSDetails(this.posId);
      }
    });
  }

  fetchPOSDetails(id: number): void {
    this.posService.getPOSById(id).subscribe(
      (data: POSWithDetails) => {
        this.pos = data;
      },
      (error) => {
        console.error('Error fetching POS details:', error);
      }
    );
  }

  // Method to handle POS update
  onUpdatePOS(): void {
    if (this.pos) {
      console.log(`Updating POS with ID: ${this.pos.posId}`);
      this.router.navigate(['/ui-components/pos/edit', this.pos.posId]);
    }
  }

  // Method to handle POS delete
  onDeletePOS(): void {
    if (confirm('Are you sure you want to delete this POS?') && this.posId) {
      this.posService.deletePOS(this.posId).subscribe(() => {
        console.log('POS deleted successfully');
        this.router.navigate(['/ui-components/pos-list']);
      }, error => {
        console.error('Error deleting POS:', error);
      });
    }
  }

  onAddPOS(): void {
    this.router.navigate(['/ui-components/add-pos']); // Redirect to the add new POS page
  }
}
