import { HttpException, HttpStatus } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common/exceptions/unauthorized.exception";

export class SupabaseAuthException extends HttpException {
    constructor(message: string) {
        super(`Supabase Auth Error: ${message}`, HttpStatus.UNAUTHORIZED);
    }
}

export class RoleNotInitializedException extends UnauthorizedException {
    constructor() {
        super('roles not initialized');
    }
}

// En el servicio
//if (error) throw new SupabaseAuthError(error.message);