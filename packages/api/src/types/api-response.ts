/**
 * Standard API response wrapper from the ticketapp API.
 * All API responses are wrapped in this structure.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}
