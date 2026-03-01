import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  nome = '';
  email = '';
  senha = '';
  erro = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  register(){
    this.auth.register(this.nome, this.email, this.senha).subscribe({
      next: () => {
        alert('Usuário criado com sucesso');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.erro = err.error;
      }
    });
  }
}
