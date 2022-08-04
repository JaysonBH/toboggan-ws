import { Component } from '@angular/core';
import { ModalButtonConfig } from '@snhuproduct/toboggan-ui-components-library';
import { IUser } from '@toboggan-ws/toboggan-common';
import { CreateUserComponent } from '../../components/create-user/create-user.component';
import { UpdateUserComponent } from '../../components/update-user/update-user.component';

@Component({
  selector: 'toboggan-ws-user-main-page',
  templateUrl: './user-main-page.component.html',
  styleUrls: ['./user-main-page.component.scss'],
})
export class UserMainPageComponent {
  editingUser?: IUser;
  createUserDialogTitle = 'Add New User';

  createUserComponent?: CreateUserComponent;
  createUserModalButtonsConfig: ModalButtonConfig[] = [
    {
      title: 'Cancel',
      onClick: () => this.handleCancelCreateUserModalButton(),
      style: 'secondary',
    },
    {
      title: 'Add New User',
      onClick: () => this.handleAddNewUserModalButton(),
      style: 'primary',
    },
  ];

  updateUserDialogTitle = 'Edit User';

  updateUserComponent?: UpdateUserComponent;
  updateUserModalButtonsConfig: ModalButtonConfig[] = [
    {
      title: 'Cancel',
      onClick: () => this.handleCancelCreateUserModalButton(),
      style: 'secondary',
    },
    {
      title: 'Review Changes',
      onClick: () => this.handleAddNewUserModalButton(),
      style: 'primary',
    },
  ];

  async handleCancelCreateUserModalButton() {
    return true;
  }

  async handleAddNewUserModalButton() {
    if (!this.createUserComponent) {
      return false;
    }
    const result = await this.createUserComponent.handleAddNewUserModalButton();
    return result;
  }

  receiveCreateUserHandle = (handle: CreateUserComponent) => {
    this.createUserComponent = handle;
  };

  receiveUpdateUserHandle = (handle: UpdateUserComponent) => {
    this.updateUserComponent = handle;
  };
}
