import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  nome = '';
  email = '';
  senha = '';
  erro = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.nome || !this.email || !this.senha) return;
    this.loading = true;
    this.erro = '';

    this.auth.register({ nome: this.nome, email: this.email, senha: this.senha }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (e) => {
        this.erro = e.error?.erro || 'Erro ao criar conta.';
        this.loading = false;
      }
    });
  }
}