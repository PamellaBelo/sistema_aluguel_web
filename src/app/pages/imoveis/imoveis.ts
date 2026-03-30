import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Imovel, Unidade } from '../../services/api.service';

@Component({
  selector: 'app-imoveis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './imoveis.html',
  styleUrl: './imoveis.scss'
})
export class Imoveis implements OnInit {
  imoveis: Imovel[] = [];
  loading = true;
  erro = '';
  erroUnidade = '';

  // Modal imóvel
  showModal = false;
  salvando = false;
  editandoId: number | null = null;
  form = { nome: '', endereco: '' };

  // Modal edição completa (nome + endereço + unidades)
  showModalEditar = false;
  imovelEditando: Imovel | null = null;
  unidades: Unidade[] = [];
  loadingUnidades = false;
  formEditar = { nome: '', endereco: '' };
  salvandoEditar = false;

  // Unidades dentro do modal editar
  novaUnidade = '';
  salvandoUnidade = false;
  editandoUnidadeId: number | null = null;
  editandoUnidadeNome = '';
  salvandoUnidadeEdit = false;

  // Modal criar — adicionar unidade após criar
  showModalUnidade = false;
  imovelCriadoId: number | null = null;
  imovelCriadoNome = '';
  nomeUnidade = '';
  salvandoNovaUnidade = false;

  constructor(private api: ApiService) {}
  ngOnInit() { this.carregar(); }

  carregar() {
    this.loading = true;
    this.api.getImoveis().subscribe({
      next: (i) => { this.imoveis = i; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  // ── Criar imóvel ──────────────────────────────────────
  abrirNovo() {
    this.editandoId = null;
    this.form = { nome: '', endereco: '' };
    this.erro = '';
    this.showModal = true;
  }

  fecharModal() { this.showModal = false; }

  salvar() {
    if (!this.form.nome.trim()) return;
    this.salvando = true;
    this.api.criarImovel({ nome: this.form.nome.trim(), endereco: this.form.endereco.trim() }).subscribe({
      next: (imovel) => {
        this.fecharModal();
        this.carregar();
        this.salvando = false;
        // Abre modal para adicionar unidades
        this.imovelCriadoId = imovel.id;
        this.imovelCriadoNome = imovel.nome;
        this.nomeUnidade = '';
        this.erroUnidade = '';
        this.showModalUnidade = true;
      },
      error: (e: any) => { this.erro = e.error?.erro || 'Erro ao criar.'; this.salvando = false; }
    });
  }

  // ── Modal unidade (pós-criação) ───────────────────────
  fecharModalUnidade() { this.showModalUnidade = false; }

  salvarUnidadeNova() {
    if (!this.nomeUnidade.trim() || !this.imovelCriadoId) return;
    this.salvandoNovaUnidade = true;
    this.api.criarUnidade({ nome: this.nomeUnidade.trim(), imovelId: this.imovelCriadoId }).subscribe({
      next: () => { this.nomeUnidade = ''; this.salvandoNovaUnidade = false; this.carregar(); },
      error: (e: any) => { this.erroUnidade = e.error?.erro || 'Erro.'; this.salvandoNovaUnidade = false; }
    });
  }

  // ── Modal edição completa ─────────────────────────────
  abrirEditar(im: Imovel) {
    this.imovelEditando = im;
    this.formEditar = { nome: im.nome, endereco: im.endereco || '' };
    this.erroUnidade = '';
    this.novaUnidade = '';
    this.editandoUnidadeId = null;
    this.showModalEditar = true;
    this.carregarUnidades(im.id);
  }

  fecharModalEditar() { this.showModalEditar = false; this.carregar(); }

  carregarUnidades(imovelId: number) {
    this.loadingUnidades = true;
    this.api.getUnidadesPorImovel(imovelId).subscribe({
      next: (u) => { this.unidades = u; this.loadingUnidades = false; },
      error: () => { this.loadingUnidades = false; }
    });
  }

  salvarEdicao() {
    if (!this.formEditar.nome.trim() || !this.imovelEditando) return;
    this.salvandoEditar = true;
    this.api.atualizarImovel(this.imovelEditando.id, {
      nome: this.formEditar.nome.trim(),
      endereco: this.formEditar.endereco.trim()
    }).subscribe({
      next: (im) => {
        this.imovelEditando = im;
        this.salvandoEditar = false;
        this.carregar();
      },
      error: (e: any) => { this.erro = e.error?.erro || 'Erro ao salvar.'; this.salvandoEditar = false; }
    });
  }

  // ── Unidades no modal editar ──────────────────────────
  adicionarUnidade() {
    if (!this.novaUnidade.trim() || !this.imovelEditando) return;
    this.salvandoUnidade = true;
    this.api.criarUnidade({ nome: this.novaUnidade.trim(), imovelId: this.imovelEditando.id }).subscribe({
      next: () => {
        this.novaUnidade = '';
        this.salvandoUnidade = false;
        this.carregarUnidades(this.imovelEditando!.id);
        this.carregar();
      },
      error: (e: any) => { this.erroUnidade = e.error?.erro || 'Erro.'; this.salvandoUnidade = false; }
    });
  }

  iniciarEditarUnidade(u: Unidade) {
    this.editandoUnidadeId = u.id;
    this.editandoUnidadeNome = u.nome;
  }

  cancelarEditarUnidade() { this.editandoUnidadeId = null; }

  salvarEditarUnidade(u: Unidade) {
    if (!this.editandoUnidadeNome.trim() || !this.imovelEditando) return;
    this.salvandoUnidadeEdit = true;
    this.api.atualizarUnidade(u.id, {
      nome: this.editandoUnidadeNome.trim(),
      imovelId: this.imovelEditando.id,
      status: u.status
    }).subscribe({
      next: () => {
        this.editandoUnidadeId = null;
        this.salvandoUnidadeEdit = false;
        this.carregarUnidades(this.imovelEditando!.id);
      },
      error: (e: any) => { this.erroUnidade = e.error?.erro || 'Erro.'; this.salvandoUnidadeEdit = false; }
    });
  }

  deletarUnidade(id: number) {
    if (!confirm('Deseja excluir esta unidade?')) return;
    this.api.deletarUnidade(id).subscribe({
      next: () => { this.carregarUnidades(this.imovelEditando!.id); this.carregar(); },
      error: (e: any) => alert(e.error?.erro || 'Erro ao deletar.')
    });
  }

  // ── Deletar imóvel ────────────────────────────────────
  deletar(id: number) {
    if (!confirm('Deseja excluir este imóvel?')) return;
    this.api.deletarImovel(id).subscribe({
      next: () => this.carregar(),
      error: (e: any) => alert(e.error?.erro || 'Erro ao deletar.')
    });
  }

  statusLabel(s: string): string {
    return s === 'VAGA' ? 'Vaga' : s === 'ALUGADA' ? 'Alugada' : 'Manutenção';
  }
  statusClass(s: string): string {
    return s === 'VAGA' ? 'badge-success' : s === 'ALUGADA' ? 'badge-info' : 'badge-warn';
  }
}