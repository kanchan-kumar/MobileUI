import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../components/_guards/auth.guard';
import { LoginComponent } from '../components/login/login.component';
import { DashboardContainerComponent } from '../components/dashboard-container/dashboard-container.component';
import { DashboardTestRunComponent } from '../components/dashboard-test-run/dashboard-test-run.component';
import { HomeComponent } from '../components/home/home.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent, pathMatch: 'full' },
            { path: 'home', component: HomeComponent,
                children: [
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    // { path: 'dashboard', component: DashboardContainerComponent, pathMatch: 'full', canActivate: [AuthGuard] },
                    { path: 'dashboard', component: DashboardContainerComponent, pathMatch: 'full' },
                    { path: 'testrun', component: DashboardTestRunComponent},
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class CavissonUIRoutingModule { }
