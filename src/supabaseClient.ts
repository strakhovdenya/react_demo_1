import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY as string;

if (!supabaseUrl) {
  // eslint-disable-next-line no-console
  console.error('ОШИБКА: Переменная REACT_APP_SUPABASE_URL не определена! Проверьте .env.local и перезапустите сервер.');
  throw new Error('supabaseUrl is required.');
}
if (!supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error('ОШИБКА: Переменная REACT_APP_SUPABASE_ANON_KEY не определена! Проверьте .env.local и перезапустите сервер.');
  throw new Error('supabaseAnonKey is required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 