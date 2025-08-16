import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, computed, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.backendUrl;
  private http = inject(HttpClient);

  private _userId: WritableSignal<string | null> = signal(null)
  isAuth = computed(() => !!this._userId() && this._userId()!.length > 0)
  userId = computed(() => this._userId())

  // Check if the user is authenticated
  checkAuth(): Observable<boolean> {
    return this.http.get<{ userId: string }>(`${this.baseUrl}/me`)
      .pipe(
        tap(response => this._userId.set(response.userId)),
        map(() => true),
        catchError(err => {
          console.log(err)
          this._userId.set(null); 
          return of(false);
        })
      );
  }

  // Sign in the user
  signin(username: string, password: string): Observable<boolean> {
    return this.http.post(`${this.baseUrl}/signin`, { username: username, password: password })
      .pipe(
        switchMap(() => this.checkAuth()),
        map(() => true),
        catchError(() => of(false))
      );
  }

  // Sign up the user
  signup(username: string, email: string, password: string): Observable<boolean> {
    return this.http.post(`${this.baseUrl}/signup`, { username, email, password })
    .pipe(
      switchMap(() => this.checkAuth()),
      map(() => true),
      catchError(() => of(false))
    );
  }

  // Refresh the token if expired
  refreshToken(): Observable<boolean> {
    return this.http.post(`${this.baseUrl}/refresh-token`, null)
      .pipe(
        switchMap(() => this.checkAuth()),
        map(() => true),
        catchError(err => {
          this._userId.set(null);
          console.log(err)
          return of(false)
        })
      );
  }

  // Log out the user
  logout(): Observable<boolean> {
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      switchMap(() => this.checkAuth()),
      catchError(err => {
        console.log(err);
        return this.checkAuth();
      })
    )
  }
}
