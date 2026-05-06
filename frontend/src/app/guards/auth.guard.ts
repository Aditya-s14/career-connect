import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export function roleGuard(requiredRole?: UserRole): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.getCurrentUser();

    if (!authService.isLoggedIn() || !user) {
      return router.createUrlTree(['/auth']);
    }

    if (requiredRole && user.role !== requiredRole) {
      return router.createUrlTree([user.role === 'candidate' ? '/candidate' : '/employer']);
    }

    return true;
  };
}
