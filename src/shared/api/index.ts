// API configuration and services will be exported from here
export const API_BASE_URL = "https://jsonplaceholder.typicode.com"

export type ApiResponse<T> = {
  data: T
  status: number
  statusText: string
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = "ApiError"
  }
}