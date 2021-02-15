import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { TokenComponent } from '../../pages/token/token.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',          component: LoginComponent },
    { path: 'login/token',       component: TokenComponent }
];
