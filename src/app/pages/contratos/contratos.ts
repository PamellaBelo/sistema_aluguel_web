import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Contrato, Inquilino, Unidade } from '../../services/api.service';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contratos.html',
 //git  styleUrl: './contratos.scss'
})
export class Contratos implements OnInit {
  contratos: Contrato[] = [];
  //casas: Casa[] = [];
  unidades: Unidade[] = [];
  inquilinos: Inquilino[] = [];
  loading = true;
  erro = '';
  showModal = false;
  salvando = false;
  nomeUnidade: string = '';

  form = {
    unidadeId: null as number | null,  // era casaId
    inquilinoId: null as number | null,
    valorAluguel: null as number | null,
    dataInicio: '',
    dataFim: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getUnidadesPorStatus('VAGA').subscribe(u => this.unidades = u);
    this.api.getInquilinos().subscribe(i => this.inquilinos = i);
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.api.getContratos().subscribe({
      next: (c) => { this.contratos = c; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  abrirModal() {
    this.form = { unidadeId: null, inquilinoId: null, valorAluguel: null, dataInicio: '', dataFim: '' };
    this.erro = '';
    this.showModal = true;
    this.api.getUnidades().subscribe(c => this.unidades = c.filter(x => x.status === 'VAGA'));
  }
  fecharModal() { this.showModal = false; }

  salvar() {
    this.api.criarContrato({
      unidadeId: this.form.unidadeId!,
      inquilinoId: this.form.inquilinoId!,
      valorAluguel: this.form.valorAluguel!,
      dataInicio: this.form.dataInicio,
      dataFim: this.form.dataFim
    }).subscribe({
      next: () => { this.fecharModal(); this.carregar(); this.salvando = false; },
      error: (e) => { this.erro = e.error?.erro || 'Erro ao criar contrato.'; this.salvando = false; }
    });
  }

  encerrar(id: number) {
    if (!confirm('Deseja encerrar este contrato? A unidade ficará disponível novamente.')) return;
    this.api.encerrarContrato(id).subscribe({
      next: () => this.carregar(),
      error: (e) => alert(e.error?.erro || 'Erro ao encerrar.')
    });
  }

  formatCurrency(v: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }

  formatDate(d: string): string {
    return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR');
  }
}