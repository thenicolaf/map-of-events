import { httpClient } from './index'
import type { User } from '@/entities/user'

export class UsersApi {
  static async getUsers(): Promise<User[]> {
    return httpClient.get<User[]>('/users')
  }

  static async getUserById(id: number): Promise<User> {
    return httpClient.get<User>(`/users/${id}`)
  }

  static async createUser(userData: Omit<User, 'id'>): Promise<User> {
    return httpClient.post<User>('/users', userData)
  }

  static async updateUser(id: number, userData: Partial<User>): Promise<User> {
    return httpClient.put<User>(`/users/${id}`, userData)
  }

  static async deleteUser(id: number): Promise<void> {
    return httpClient.delete<void>(`/users/${id}`)
  }
}

export const usersApi = UsersApi