import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  email = '';
  senha = '';
  erro = '';
  
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}


  login() {
    this.auth.login(this.email, this.senha).subscribe({
      next: (token: string) => {
        console.log("Token recebido:", token);
        this.auth.saveToken(token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.log(err);
        this.erro = err.error || 'Email ou senha inválidos';
      }
    });
  }
}
