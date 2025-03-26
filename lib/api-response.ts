export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export class ApiResponseBuilder {
  static success<T>(data: T, meta?: ApiResponse['meta']): ApiResponse<T> {
    return {
      success: true,
      data,
      meta,
    };
  }

  static error(
    code: string,
    message: string,
    details?: any
  ): ApiResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number
  ): ApiResponse<T[]> {
    return {
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
      },
    };
  }
} 