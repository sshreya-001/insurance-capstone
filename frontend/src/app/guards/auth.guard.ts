import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.currentUser;
  if (!user) {
    router.navigateByUrl('/login');
    return false;
  }

  const requiredRole = route.data?.['role'] as 'customer' | 'agent' | 'admin' | undefined;
  if (requiredRole && user.role !== requiredRole) {
    router.navigateByUrl(`/${user.role}`);
    return false;
  }

  return true;
};
