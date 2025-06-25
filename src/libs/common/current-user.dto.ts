import { FileDto } from './file-dto';

export type CurrentUserDto = {
  id: string;
  email?: string;
  firstName: string;
  middleName: string;
  lastName?: string;
  gender?: string;
  phone: string;
  jobTitle?: string;
  departmentId?: string;
  roles?: string[];
  profilePicture?: FileDto;
};
