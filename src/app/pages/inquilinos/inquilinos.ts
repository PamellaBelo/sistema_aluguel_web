import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Inquilino } from '../../services/api.service';

@Component({
  selector: 'app-inquilinos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inquilinos.html',
  styleUrl: './inquilinos.css'
})
export class Inquilinos implements OnInit {
  inquilinos: Inquilino[] = [];
  loading = true;
  erro = '';
  showModal = false;
  salvando = false;
  editandoId: number | null = null;

  form: Omit<Inquilino, 'id'> = { nome: '', cpf: '', telefone: '', email: '' };

  constructor(private api: ApiService) {}
  ngOnInit() { this.carregar(); }

  carregar() {
    this.loading = true;
    this.api.getInquilinos().subscribe({
      next: (i) => { this.inquilinos = i; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  abrirNovo() {
    this.editandoId = null;
    this.form = { nome: '', cpf: '', telefone: '', email: '' };
    this.erro = ''; this.showModal = true;
  }

  abrirEditar(i: Inquilino) {
    this.editandoId = i.id;
    this.form = { nome: i.nome, cpf: i.cpf, telefone: i.telefone, email: i.email };
    this.erro = ''; this.showModal = true;
  }

  fecharModal() { this.showModal = false; }

  salvar() {
    if (!this.form.nome.trim()) return;
    this.salvando = true;
    const req = this.editandoId
      ? this.api.atualizarInquilino(this.editandoId, this.form)
      : this.api.criarInquilino(this.form);
    req.subscribe({
      next: () => { this.fecharModal(); this.carregar(); this.salvando = false; },
      error: (e) => { this.erro = e.error?.erro || 'Erro ao salvar.'; this.salvando = false; }
    });
  }

  deletar(id: number) {
    if (!confirm('Deseja excluir este inquilino?')) return;
    this.api.deletarInquilino(id).subscribe({
      next: () => this.carregar(),
      error: (e) => alert(e.error?.erro || 'Erro ao deletar.')
    });
  }
}