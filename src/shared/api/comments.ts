import { httpClient } from './index'
import type { Comment } from '@/entities/post'

export class CommentsApi {
  static async getComments(): Promise<Comment[]> {
    return httpClient.get<Comment[]>('/comments')
  }

  static async getCommentById(id: number): Promise<Comment> {
    return httpClient.get<Comment>(`/comments/${id}`)
  }

  static async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return httpClient.get<Comment[]>(`/comments?postId=${postId}`)
  }

  static async createComment(commentData: Omit<Comment, 'id'>): Promise<Comment> {
    return httpClient.post<Comment>('/comments', commentData)
  }

  static async updateComment(id: number, commentData: Partial<Comment>): Promise<Comment> {
    return httpClient.put<Comment>(`/comments/${id}`, commentData)
  }

  static async deleteComment(id: number): Promise<void> {
    return httpClient.delete<void>(`/comments/${id}`)
  }
}

export const commentsApi = CommentsApi