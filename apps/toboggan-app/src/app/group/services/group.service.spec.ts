import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IGroup } from '@toboggan-ws/toboggan-common';
import { GroupService } from './group.service';

describe('GroupService', () => {
  let service: GroupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(GroupService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  describe('Group Service', () => {
    it('should have called api for fetching groups', () => {
      service.fetchGroups().subscribe();
      const req = httpMock.expectOne(`/api/groups`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
    it('should have called api for create group', () => {
      const group: IGroup = {
        id: '2AE9GWE5E1A9',
        name: 'Admin',
        type: 0,
        description: '',
      };
      service.createGroup(group).subscribe();
      const req = httpMock.expectOne(`/api/groups`);
      expect(req.request.method).toBe('POST');
      req.flush(group);
    });

    it('should have called api for update group', async () => {
      const group: IGroup = {
        id: '2AE9GWE5E1A9',
        name: 'Admin',
        type: 0,
        description: '',
      };
      setTimeout(() => {
        const req = httpMock.expectOne('/api/groups/:' + group.id);
        req.flush(group);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toBe(group);
        httpMock.verify();
      });
      await service.updateGroup(group);
    });

    it('should have called api for add user to group', () => {
      const group: IGroup = {
        id: '2AE9GWE5E1A9',
        name: 'Admin',
        type: 0,
        description: '',
      };
      const userEmail = 'user@sada.com';
      const mockRequest = {
        groupId: group.id,
        user: userEmail,
      };
      service.addUsertoGroup(group.id as string, userEmail).subscribe();
      const req = httpMock.expectOne('/api/groups/addusertogroup');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toStrictEqual(mockRequest);
      req.flush(group);
    });
  });
});
