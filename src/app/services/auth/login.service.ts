import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, BehaviorSubject, tap } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<User> = new BehaviorSubject<User>({id:0, email:''});  //aca despues se trabaja con localsesionstorage

  constructor( private http:HttpClient) { }

  login(credentials:LoginRequest):Observable<User>{
    return this.http.get<User>('././assets/data/data.json').pipe(
      tap( userData =>{
        this.currentUserData.next(userData);
        this.currentUserLoginOn.next(true);
      }),
      catchError(this.handleError)
    )
  }

  private handleError(error:HttpErrorResponse){
    if (error.status===0){
      console.error('Se ha producido un error ', error.error);
    } else {
      console.error('Backend retornó el codigo de estado ', error.status, error.error);
    }
    return throwError(()=> new Error ('Algo falló. Por favor intente nuevamente.'));
  }

  get userLoginOn():Observable<boolean>{
    return this.currentUserLoginOn.asObservable();
  }

  get userData():Observable<User>{
    return this.currentUserData.asObservable();
  }
}
