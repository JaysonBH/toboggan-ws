import { Injectable } from '@nestjs/common';
import { IAddUserToGroup, IGroup } from '@toboggan-ws/toboggan-common';
import * as arrayPaginate from 'array-paginate';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GroupsService {
  groups: IGroup[] = [];

  constructor() {
    for (let i = 0; i < 20; i++) {
      this.groups.push({
        id: uuidv4(),
        name: `Group name-${i}`,
        description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.`,
      });
    }
  }

  getGroups(): IGroup[] {
    return this.groups;
  }

  getPaginatedGroups(currentPage: number, resultsPerPage = 10): IGroup[] {
    const paginatedGroups = arrayPaginate(
      this.groups,
      currentPage,
      resultsPerPage
    );

    return paginatedGroups;
  }

  createGroup(newGroup: IGroup) {
    this.groups.push(newGroup);
  }

  updateGroup(id: string, updatedGroup: IGroup) {
    this.groups = this.groups.map((group) => {
      if (group.id === id) {
        return {
          id: group.id,
          ...updatedGroup,
        };
      }
      return group;
    });
  }

  patchGroup(id: string, updatedGroup: IGroup) {
    this.groups = this.groups.map((group) => {
      if (group.id === id) {
        return {
          ...group,
          ...updatedGroup,
        };
      }
      return group;
    });
  }

  deleteGroup(id: string) {
    this.groups = this.groups.filter((group) => {
      return group.id !== id;
    });
  }

  addUsersToGroup(request: IAddUserToGroup) {
    console.log(request);
  }
}