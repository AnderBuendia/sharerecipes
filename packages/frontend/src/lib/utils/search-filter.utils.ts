import type { UserProfile } from '@Interfaces/domain/user.interface';

export const searchFilterUsers = (users: UserProfile[], q: string) => {
  const columns = users[0] && Object.keys(users[0]);

  return users.filter((row) =>
    columns.some(
      (column) =>
        row[column as keyof UserProfile].toString().toLowerCase().indexOf(q) >
        -1
    )
  );
};
