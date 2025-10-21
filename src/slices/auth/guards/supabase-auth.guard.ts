import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { supabase } from 'src/shared/supabase.client';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.replace('Bearer ', '');

        if (!token) {
            throw new UnauthorizedException('Token de autorización requerido');
        }

        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data.user) {
            throw new UnauthorizedException('Token inválido');
        }
        // Guardamos info del usuario para que esté disponible en el request
        req.user = data.user;

        return true;
    }
}
