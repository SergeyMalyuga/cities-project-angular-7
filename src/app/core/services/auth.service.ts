import { Injectable } from '@angular/core';
import { Token } from '../models/token';
import { AUTH_TOKEN_KEY_NAME } from '../constants/const';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public getToken(): Token | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY_NAME);
    } catch (error) {
      console.error('Error get token from localstorage', error);
      return null;
    }
  }

  public setToken(token: Token): boolean {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY_NAME, token);
      return true;
    } catch (error) {
      console.error('Error set token from localstorage', error);
      return false;
    }
  }

  public removeToken(): boolean {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY_NAME);
      return true;
    } catch (error) {
      console.error('Error remove token from localstorage', error);
      return false;
    }
  }
}
