import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Pagamento, Contrato } from '../../services/api.service';

@Component({
  selector: 'app-pagamentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagamentos.html',
  styleUrl: './pagamentos.css'
})
export class Pagamentos implements OnInit {
  pagamentos: Pagamento[] = [];
  contratos: Contrato[] = [];
  loading = true;
  erro = '';
  showModal = false;
  salvando = false;

  form = { contratoId: null as number | null, dataPagamento: '', mesReferencia: '' };

  statusLabels: Record<string, string> = {
    PAGO: 'Pago', PENDENTE: 'Pendente', ATRASADO: 'Atrasado', CANCELADO: 'Cancelado'
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getContratos().subscribe(c => this.contratos = c.filter(x => x.ativo));
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.api.getPagamentos().subscribe({
      next: (p) => { this.pagamentos = p; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  abrirModal() {
    const hoje = new Date().toISOString().split('T')[0];
    this.form = { contratoId: null, dataPagamento: hoje, mesReferencia: hoje.substring(0, 7) };
    this.erro = ''; this.showModal = true;
  }
  fecharModal() { this.showModal = false; }

  salvar() {
    if (!this.form.contratoId || !this.form.dataPagamento || !this.form.mesReferencia) return;
    this.salvando = true;
    this.api.registrarPagamento({
      contratoId: this.form.contratoId,
      dataPagamento: this.form.dataPagamento,
      mesReferencia: this.form.mesReferencia + '-01'
    }).subscribe({
      next: () => { this.fecharModal(); this.carregar(); this.salvando = false; },
      error: (e) => { this.erro = e.error?.erro || 'Erro ao registrar.'; this.salvando = false; }
    });
  }

  deletar(id: number) {
    if (!confirm('Deseja excluir este pagamento?')) return;
    this.api.deletarPagamento(id).subscribe({
      next: () => this.carregar(),
      error: (e) => alert(e.error?.erro || 'Erro ao deletar.')
    });
  }

  badgeClass(status: string): string {
    const map: Record<string, string> = { PAGO: 'badge-success', PENDENTE: 'badge-warn', ATRASADO: 'badge-danger', CANCELADO: 'badge-muted' };
    return map[status] || 'badge-muted';
  }

  formatCurrency(v: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }

  formatDate(d: string): string { return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR'); }

  formatMes(d: string): string {
    return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }
}