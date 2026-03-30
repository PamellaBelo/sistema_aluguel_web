
import { Routes } from '@angular/router';
import { Unidades } from './pages/unidades/unidades';
//euimport { Casa } from './pages/casa/casa';
import { Inquilinos } from './pages/inquilinos/inquilinos';
import { Contratos } from './pages/contratos/contratos';
import { Contas } from './pages/contas/contas';
import { Pagamentos } from './pages/pagamentos/pagamentos';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './auth/auth.guard';
import { Layout } from './pages/layout/layout';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Imoveis } from './pages/imoveis/imoveis';


export const routes: Routes = [
  { path: 'login',    component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '',          redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',  component: Dashboard  },
      { path: 'unidades',   component: Unidades   },
  //    { path: 'casa',       component: Casa       },
      { path: 'inquilinos', component: Inquilinos },
      { path: 'contratos',  component: Contratos  },
      { path: 'contas',     component: Contas     },
      { path: 'pagamentos', component: Pagamentos },
      { path: 'imoveis',    component: Imoveis    },
    ]
  },
  { path: '**', redirectTo: 'login' }
];