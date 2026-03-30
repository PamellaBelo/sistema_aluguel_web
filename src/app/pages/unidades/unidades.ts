import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Unidade, Imovel } from '../../services/api.service';

@Component({
  selector: 'app-unidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unidades.html',
  styleUrl: './unidades.scss'
})
export class Unidades implements OnInit {
  unidades: Unidade[] = [];
  imoveis: Imovel[] = [];
  loading = true;
  erro = '';
  showModal = false;
  salvando: boolean = false;
  editandoId: number | null = null;
  filtroStatus = '';
  nome: string = '';

  form = { nome: '', imovelId: null as number | null, status: 'VAGA' };

  statusLabels: Record<string, string> = { VAGA: 'Vaga', ALUGADA: 'Alugada', MANUTENCAO: 'Manutenção' };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getImoveis().subscribe(i => this.imoveis = i);
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.api.getUnidades().subscribe({
      next: (u) => { this.unidades = u; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get unidadesFiltradas(): Unidade[] {
    return this.filtroStatus ? this.unidades.filter(u => u.status === this.filtroStatus) : this.unidades;
  }

  abrirNovo() {
    this.editandoId = null;
    this.form = { nome: '', imovelId: null, status: 'VAGA' };
    this.erro = '';
    this.showModal = true;
  }

  abrirEditar(u: Unidade) {
    this.editandoId = u.id;
    this.form = { nome: u.nome, imovelId: u.imovelId, status: u.status };
    this.erro = '';
    this.showModal = true;
  }

  abrirModal() {
    console.log('Abrindo modal');
  }
  fecharModal() { this.showModal = false; }

  salvar() {
    if (!this.form.nome.trim() || !this.form.imovelId) return;
    this.salvando = true;
    const data = { nome: this.form.nome.trim(), imovelId: this.form.imovelId, status: this.form.status };
    const req = this.editandoId
      ? this.api.atualizarUnidade(this.editandoId, data)
      : this.api.criarUnidade(data);
    req.subscribe({
      next: () => { this.fecharModal(); this.carregar(); this.salvando = false; },
      error: (e: any) => { this.erro = e.error?.erro || 'Erro ao salvar.'; this.salvando = false; }
    });
  }

  deletar(id: number) {
    if (!confirm('Deseja excluir esta unidade?')) return;
    this.api.deletarUnidade(id).subscribe({
      next: () => this.carregar(),
      error: (e: any) => alert(e.error?.erro || 'Erro ao deletar.')
    });
  }

  badgeClass(status: string): string {
    return status === 'VAGA' ? 'badge-success' : status === 'ALUGADA' ? 'badge-info' : 'badge-warn';
  }
}