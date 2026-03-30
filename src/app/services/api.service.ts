import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Imovel {
  id: number;
  nome: string;
  endereco: string;
  totalUnidades: number;
}

export interface Unidade {
  id: number;
  nome: string;
  imovelId: number;
  nomeImovel: string;
  status: 'VAGA' | 'ALUGADA' | 'MANUTENCAO';
}

export interface Inquilino {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
}

export interface Contrato {
  id: number;
  unidadeId: number;
  nomeUnidade: string;
  nomeImovel: string;
  inquilinoId: number;
  nomeInquilino: string;
  valorAluguel: number;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
}

export interface Conta {
  id: number;
  contratoId: number;
  tipo: string;
  valor: number;
  vencimento: string;
}

export interface Pagamento {
  id: number;
  contratoId: number;
  nomeInquilino: string;
  nomeUnidade: string;
  nomeImovel: string;
  valorPago: number;
  dataPagamento: string;
  mesReferencia: string;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
}

export interface DashboardData {
  totalImoveis: number;
  totalUnidades: number;
  unidadesAlugadas: number;
  unidadesVagas: number;
  valorTotalReceber: number;
  contasPendentes: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.base}/dashboard`);
  }

  // Imóveis
  getImoveis(): Observable<Imovel[]> {
    return this.http.get<Imovel[]>(`${this.base}/imoveis`);
  }
  criarImovel(data: { nome: string; endereco?: string }): Observable<Imovel> {
    return this.http.post<Imovel>(`${this.base}/imoveis`, data);
  }
  atualizarImovel(id: number, data: { nome: string; endereco?: string }): Observable<Imovel> {
    return this.http.put<Imovel>(`${this.base}/imoveis/${id}`, data);
  }
  deletarImovel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/imoveis/${id}`);
  }

  // Unidades
  getUnidades(): Observable<Unidade[]> {
    return this.http.get<Unidade[]>(`${this.base}/unidades`);
  }
  getUnidadesPorImovel(imovelId: number): Observable<Unidade[]> {
    return this.http.get<Unidade[]>(`${this.base}/unidades/imovel/${imovelId}`);
  }
  getUnidadesPorStatus(status: string): Observable<Unidade[]> {
    return this.http.get<Unidade[]>(`${this.base}/unidades/status/${status}`);
  }
  criarUnidade(data: { nome: string; imovelId: number; status?: string }): Observable<Unidade> {
    return this.http.post<Unidade>(`${this.base}/unidades`, data);
  }
  atualizarUnidade(id: number, data: { nome: string; imovelId: number; status?: string }): Observable<Unidade> {
    return this.http.put<Unidade>(`${this.base}/unidades/${id}`, data);
  }
  deletarUnidade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/unidades/${id}`);
  }

  // Inquilinos
  getInquilinos(): Observable<Inquilino[]> {
    return this.http.get<Inquilino[]>(`${this.base}/inquilinos`);
  }
  getInquilino(id: number): Observable<Inquilino> {
    return this.http.get<Inquilino>(`${this.base}/inquilinos/${id}`);
  }
  criarInquilino(data: Omit<Inquilino, 'id'>): Observable<Inquilino> {
    return this.http.post<Inquilino>(`${this.base}/inquilinos`, data);
  }
  atualizarInquilino(id: number, data: Omit<Inquilino, 'id'>): Observable<Inquilino> {
    return this.http.put<Inquilino>(`${this.base}/inquilinos/${id}`, data);
  }
  deletarInquilino(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/inquilinos/${id}`);
  }

  // Contratos
  getContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.base}/contratos`);
  }
  getContrato(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.base}/contratos/${id}`);
  }
  criarContrato(data: {
    unidadeId: number; inquilinoId: number;
    valorAluguel: number; dataInicio: string; dataFim: string;
  }): Observable<Contrato> {
    return this.http.post<Contrato>(`${this.base}/contratos`, data);
  }
  encerrarContrato(id: number): Observable<Contrato> {
    return this.http.put<Contrato>(`${this.base}/contratos/${id}/encerrar`, {});
  }
  getTotalMensal(id: number): Observable<number> {
    return this.http.get<number>(`${this.base}/contratos/${id}/total-mensal`);
  }

  // Contas
  getContasPorContrato(contratoId: number): Observable<Conta[]> {
    return this.http.get<Conta[]>(`${this.base}/contas/contrato/${contratoId}`);
  }
  criarConta(data: { contratoId: number; tipo: string; valor: number; vencimento: string }): Observable<Conta> {
    return this.http.post<Conta>(`${this.base}/contas`, data);
  }
  deletarConta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/contas/${id}`);
  }

  // Pagamentos
  getPagamentos(): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(`${this.base}/pagamentos`);
  }
  getPagamentosPorContrato(contratoId: number): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(`${this.base}/pagamentos/contrato/${contratoId}`);
  }
  registrarPagamento(data: {
    contratoId: number; dataPagamento: string; mesReferencia: string;
  }): Observable<Pagamento> {
    return this.http.post<Pagamento>(`${this.base}/pagamentos`, data);
  }
  deletarPagamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/pagamentos/${id}`);
  }
}