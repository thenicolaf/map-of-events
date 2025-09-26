import { usersApi } from '@/shared/api';
import type { User } from '@/entities';
import { useApi } from './useApi';

export function useUsers() {
  return useApi<User[]>(() => usersApi.getUsers());
}

export function useUser(id: number) {
  return useApi<User>(() => usersApi.getUserById(id), {
    immediate: Boolean(id),
    dependencies: [id],
  });
}