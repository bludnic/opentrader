export interface TwitterApiErrorResponse {
  errors: Array<{ parameters: Record<string, string[]>; message: string }>;

  title: string;
  detail: string;
  type: string; // URL to the documentation
}
