import { Result, success, failure } from '@/domain/common/result';

export interface HttpClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export class HttpClient {
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = {
      timeout: 10000,
      defaultHeaders: {
        'Content-Type': 'application/json',
      },
      ...config,
    };
  }

  async request<T = any>(config: RequestConfig): Promise<Result<HttpResponse<T>>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const url = this.buildUrl(config.url, config.params);
      const headers = {
        ...this.config.defaultHeaders,
        ...config.headers,
      };

      const response = await fetch(url, {
        method: config.method || 'GET',
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await this.parseError(response);
        return failure(new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`));
      }

      const data = await response.json();

      return success({
        data,
        status: response.status,
        statusText: response.statusText,
        headers: this.parseHeaders(response.headers),
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return failure(new Error('Request timeout'));
        }
        return failure(error);
      }
      return failure(new Error('Unknown error occurred'));
    }
  }

  async get<T = any>(url: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<Result<HttpResponse<T>>> {
    return this.request<T>({ url, method: 'GET', params, headers });
  }

  async post<T = any>(url: string, body?: any, headers?: Record<string, string>): Promise<Result<HttpResponse<T>>> {
    return this.request<T>({ url, method: 'POST', body, headers });
  }

  async put<T = any>(url: string, body?: any, headers?: Record<string, string>): Promise<Result<HttpResponse<T>>> {
    return this.request<T>({ url, method: 'PUT', body, headers });
  }

  async patch<T = any>(url: string, body?: any, headers?: Record<string, string>): Promise<Result<HttpResponse<T>>> {
    return this.request<T>({ url, method: 'PATCH', body, headers });
  }

  async delete<T = any>(url: string, headers?: Record<string, string>): Promise<Result<HttpResponse<T>>> {
    return this.request<T>({ url, method: 'DELETE', headers });
  }

  private buildUrl(url: string, params?: Record<string, any>): string {
    const fullUrl = url.startsWith('http') ? url : `${this.config.baseUrl}${url}`;

    if (!params) {
      return fullUrl;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const paramString = searchParams.toString();
    return paramString ? `${fullUrl}?${paramString}` : fullUrl;
  }

  private parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  private async parseError(response: Response): Promise<{ message: string; details?: any }> {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return { message: response.statusText };
    } catch {
      return { message: response.statusText };
    }
  }
}