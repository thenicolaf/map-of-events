import { httpClient } from './index'
import type { Post, Comment } from '@/entities/post'

export class PostsApi {
  static async getPosts(): Promise<Post[]> {
    return httpClient.get<Post[]>('/posts')
  }

  static async getPostById(id: number): Promise<Post> {
    return httpClient.get<Post>(`/posts/${id}`)
  }

  static async getPostsByUserId(userId: number): Promise<Post[]> {
    return httpClient.get<Post[]>(`/posts?userId=${userId}`)
  }

  static async createPost(postData: Omit<Post, 'id'>): Promise<Post> {
    return httpClient.post<Post>('/posts', postData)
  }

  static async updatePost(id: number, postData: Partial<Post>): Promise<Post> {
    return httpClient.put<Post>(`/posts/${id}`, postData)
  }

  static async deletePost(id: number): Promise<void> {
    return httpClient.delete<void>(`/posts/${id}`)
  }

  static async getPostComments(postId: number): Promise<Comment[]> {
    return httpClient.get<Comment[]>(`/posts/${postId}/comments`)
  }
}

export const postsApi = PostsApi