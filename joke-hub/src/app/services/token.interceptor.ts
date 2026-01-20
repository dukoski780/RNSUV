import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserStoreService } from './user-store.service';

/**
 * HTTP Interceptor that adds JWT token to local API requests
 * Excludes external APIs to prevent CORS issues
 */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const userStore = inject(UserStoreService);

  // Only add Authorization header for local API calls (not external APIs)
  const isLocalApi = req.url.startsWith('/api');

  if (userStore.token && isLocalApi) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${userStore.token}`)
    });
    return next(authReq);
  }

  return next(req);
};
