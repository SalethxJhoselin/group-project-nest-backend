import { Injectable } from '@nestjs/common';
import { supabase } from './supabase.client';

@Injectable()
export class SupabaseAuthService {
    async signUp(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error || !data.user) {
            throw new Error(error?.message || 'Supabase signup failed');
        }
        return data;
    }

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        return data;
    }
}