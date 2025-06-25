export enum Gender {
  Male = 'Male',
  Female = 'Female',
}
export enum ContactMethod {
  Phone = 'phone',
  Telegram = 'telegram',
  SMS = 'sms',
  InPerson = 'inPerson',
}
export enum PaymentStatus {
  Pending = '1',
  Success = '2',
  Timeout = '3',
  Cancelled = '4',
  Failed = '5',
  Error = '-1',
}

export enum DateOfWeek {
  MONDAY = 'Mon',
  TUESDAY = 'Tue',
  WEDNESDAY = 'Wed',
  THURSDAY = 'Thu',
  FRIDAY = 'Fri',
  SATURDAY = 'Sat',
  SUNDAY = 'Sun',
}

export enum RequestStatus {
  Pending = 'pending',
  Started = 'started',
  Completed = 'completed',
}

export enum FILE_FOLDERS {
  USER_FOLDER = 'dev_chat_user',
  CHAT_FOLDER = 'dev_chat',
  BLOG_FOLDER = 'dev_chat_blog',
}

export enum UserContactType {
  EMERGENCY = 'emergency',
  BAIL = 'bail',
  WORK = 'work',
  HOME = 'home',
  FAMILY = 'family',
  FRIEND = 'friend',
  LEGAL = 'legal',
  OTHER = 'other',
}