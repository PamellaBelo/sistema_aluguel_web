import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Conta, Contrato } from '../../services/api.service';

@Component({
  selector: 'app-contas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contas.html',
  styleUrl: './contas.css'
})
export class Contas implements OnInit {
  contas: Conta[] = [];
  contratos: Contrato[] = [];
  loading = false;
  erro = '';
  showModal = false;
  salvando = false;
  contratoFiltro: number | null = null;

  tipoLabels: Record<string, string> = {
    AGUA: 'Água', LUZ: 'Luz', INTERNET: 'Internet',
    CONDOMINIO: 'Condomínio', IPTU: 'IPTU', OUTROS: 'Outros'
  };

  form = { contratoId: null as number | null, tipo: 'AGUA', valor: null as number | null, vencimento: '' };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getContratos().subscribe(c => this.contratos = c.filter(x => x.ativo));
  }

  carregarContas() {
    if (!this.contratoFiltro) { this.contas = []; return; }
    this.loading = true;
    this.api.getContasPorContrato(this.contratoFiltro).subscribe({
      next: (c) => { this.contas = c; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  abrirModal() {
    this.form = { contratoId: this.contratoFiltro, tipo: 'AGUA', valor: null, vencimento: '' };
    this.erro = ''; this.showModal = true;
  }
  fecharModal() { this.showModal = false; }

  salvar() {
    if (!this.form.contratoId || !this.form.valor || !this.form.vencimento) return;
    this.salvando = true;
    this.api.criarConta({ contratoId: this.form.contratoId, tipo: this.form.tipo, valor: this.form.valor, vencimento: this.form.vencimento }).subscribe({
      next: () => { this.fecharModal(); this.carregarContas(); this.salvando = false; },
      error: (e) => { this.erro = e.error?.erro || 'Erro ao criar conta.'; this.salvando = false; }
    });
  }

  deletar(id: number) {
    if (!confirm('Deseja excluir esta conta?')) return;
    this.api.deletarConta(id).subscribe({
      next: () => this.carregarContas(),
      error: (e) => alert(e.error?.erro || 'Erro ao deletar.')
    });
  }

  formatCurrency(v: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }

  formatDate(d: string): string {
    return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR');
  }
}