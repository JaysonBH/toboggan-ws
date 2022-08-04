import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGroup, INewUser, IUser } from '@toboggan-ws/toboggan-common';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: IUser[] = [];
  groups: IGroup[] = [];

  constructor(private http: HttpClient) {
    this.fetchUsers();
  }

  // user handlers

  //
  // TODO: split this into "managers" so all main logic is there:
  //  - UserManager
  //  - GroupManager
  //  - etc.
  //
  //

  fetchUsers() {
    return this.http.get<IUser[]>('/api/users');
  }

  createUser(user: INewUser): Promise<unknown> {
    return firstValueFrom(this.http.post('/api/users', user));
  }

  // updates user
  updateUser(id: string, user: Partial<IUser>) {
    this.http.put(`/api/users/${id}`, user).subscribe(() => {
      this.fetchUsers();
    });
  }

  //
  enableUser() {
    this.http.put('/api/users/:id/enable/', {}).subscribe(() => {
      this.fetchUsers();
    });
  }

  //
  disableUser() {
    this.http.put('/api/users/:id/disable', {}).subscribe(() => {
      this.fetchUsers();
    });
  }


}
