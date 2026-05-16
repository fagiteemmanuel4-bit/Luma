export interface ApiResult<T = unknown> {
  data: T | null;
  time: number;
  status: 'success' | 'empty' | 'error' | 'not_found' | 'started' | 'done';
}

export type ProgressStatus = 'started' | 'done' | 'error';

export interface FanOutResults {
  results: Record<string, ApiResult<unknown>>;
  apis: string[];
}
