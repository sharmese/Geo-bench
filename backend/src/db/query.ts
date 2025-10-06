import { pool } from './index';

export const dbQuery = (text: string, params?: any[]) =>
  pool.query(text, params);
