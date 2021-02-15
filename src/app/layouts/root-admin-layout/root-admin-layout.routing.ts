import { Routes } from '@angular/router';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { EditProfileComponent } from '../../pages/edit-profile/edit-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { WelcomeComponent } from '../../pages/welcome/welcome.component';
import { UsersCreationComponent } from '../../pages/users-creation/users-creation.component';
import { UsersUpdateComponent } from '../../pages/users-update/users-update.component';
import { UsersDeleteComponent } from '../../pages/users-delete/users-delete.component';
import { UsersDetailsComponent } from '../../pages/users-details/users-details.component';

//import { RootCreationComponent } from '../../pages/root-creation/root-creation.component';


export const RootAdminLayoutRoutes: Routes = [
    //{ path: 'dashboard',      component: DashboardComponent },
    //{ path: '',              component: RootCreationComponent },
    { path: 'welcome',      		component: WelcomeComponent },
    { path: 'user-profile',   		component: UserProfileComponent },
    { path: 'edit-profile/:id',     component: EditProfileComponent },
    { path: 'tables/:page',   		component: TablesComponent },
    { path: 'userCreation',         component: UsersCreationComponent },
    { path: 'userUpdate/:id',       component: UsersUpdateComponent },
    { path: 'userDelete/:id',       component: UsersDeleteComponent },
    { path: 'userDetails/:id',      component: UsersDetailsComponent },
    //{ path: 'icons',          component: IconsComponent },
    //{ path: 'maps',           component: MapsComponent }
];
