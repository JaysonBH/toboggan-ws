import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StoriesModule } from '@snhuproduct/toboggan-ui-components-library';
import { SharedModule } from '../shared/shared.module';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { UserMainPageComponent } from './pages/user-main-page/user-main-page.component';
import { userRouting } from './user.routing';
import { UserTableComponent } from './components/user-table/user-table.component';

@NgModule({
  declarations: [
    UserMainPageComponent,
    CreateUserComponent,
    UserTableComponent,
  ],
  imports: [
    CommonModule,
    StoriesModule,
    userRouting,
    SharedModule,
    ReactiveFormsModule,
  ],

  exports: [UserMainPageComponent],
})
export class UserModule {}
