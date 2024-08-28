import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RoleGuard } from './role.guard';
import { AuthService } from './pages/authentication/services/authService';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken', 'isTokenExpired']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    guard = TestBed.inject(RoleGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access if token is valid', () => {
    authServiceSpy.getToken.and.returnValue('valid-token');
    authServiceSpy.isTokenExpired.and.returnValue(false);

    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it('should deny access and navigate to login if token is invalid or expired', () => {
    authServiceSpy.getToken.and.returnValue(null);

    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    expect(guard.canActivate(route, state)).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/authentication/login']);
  });
});
