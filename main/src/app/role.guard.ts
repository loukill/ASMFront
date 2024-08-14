import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './pages/authentication/services/authService';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getUserRole();
    if (role) {
      // Autoriser l'accès si le rôle est correct
      return true;
    } else {
      this.router.navigate(['/login']); // Redirection vers la page de login si l'utilisateur n'est pas authentifié
      return false;
    }
  }
}
