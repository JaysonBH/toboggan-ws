import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGroup, INewGroup } from '@toboggan-ws/toboggan-common';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private http: HttpClient) {}

  // Fetch all groups
  fetchGroups() {
    return this.http.get<IGroup[]>('/api/groups');
  }

  // Creates group
  createGroup(group: INewGroup) {
    return this.http.post('/api/groups', group);
  }

  // Updates group
  updateGroup(group: IGroup) {
    return this.http.put('/api/groups/:' + group.id, group);
  }

  // Add user to group
  addUsertoGroup(groupId: string, user: string) {
    return this.http.post('/api/addusertogroup', { groupId, user });
  }
}