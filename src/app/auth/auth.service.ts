import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
  })
export class AuthService{

    private API = 'http://localhost:8080/auth';

    constructor(private http: HttpClient) {}

    login(email: string, senha: string): Observable<string> {
        return this.http.post(
          `${this.API}/login`,
          { email, senha },
          { responseType: 'text' } // 👈 ESSA LINHA É A CHAVE
        );
      }

    register(nome: string, email: string, senha: string): Observable<any> {
        return this.http.post(`${this.API}/register`, {nome, email, senha});
    }

    saveToken(token: string){
        localStorage.setItem('token', token);
    }

    getToken(){
        return localStorage.getItem('token');
    }

    isLogged(): boolean {
        return !!this.getToken();
    }

    logout(){
        localStorage.removeItem('token');
    }
}