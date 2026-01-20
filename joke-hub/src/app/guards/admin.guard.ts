import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStoreService } from '../services/user-store.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStoreService);
  const router = inject(Router);

  if (!userStore.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (!userStore.isAdmin()) {
    router.navigate(['/jokes/list']);
    return false;
  }

  return true;
};
