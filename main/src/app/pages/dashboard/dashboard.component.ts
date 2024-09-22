import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../authentication/services/authService';
import { PosService } from './services/PosService';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AppDashboardComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public isClient: boolean = false;
  public posList: any[] = [];

  constructor(private authService: AuthService, private router: Router, private posService: PosService) {}

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  onPosClick(pos: any) {
    console.log('POS Selected:', pos);
    if (pos.POSId) {
      this.router.navigate(['/ui-components/calendar'], { queryParams: { posId: pos.POSId } });
    } else {
      console.error('posId is null or undefined:', pos);
    }
  }

  ngOnInit() {
    const role = this.getUserRole();
    const token = this.authService.getToken();

    if (!token || this.authService.isTokenExpired(token)) {
      this.router.navigate(['/authentication/login']);
    }

    this.isClient = (role === 'Client');

    if (this.isClient) {
      this.posService.getPosList().subscribe((data) => {
        console.log('API Response:', data);
        this.posList = data.map((pos: any) => ({
          POSId: pos.posId,
          POSName: pos.posName,
          POSLocation: pos.posLocation,
          ImageUrl: pos.imageUrl,
          Services: pos.services,
          Clients: pos.clients,
          Prestataires: pos.prestataires,
        }));
        console.log('POS List:', this.posList);
      });
    }
  }
}
