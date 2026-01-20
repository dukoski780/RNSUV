import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStoreService } from '../services/user-store.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStoreService);
  const router = inject(Router);

  if (!userStore.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
