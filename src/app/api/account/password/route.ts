import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/user-service';
import { changePasswordSchema } from '@/lib/validation/user.schema';
import { requireAuth } from '@/lib/auth/guards';
import { ZodError } from 'zod';
import { UnauthorizedError, NotFoundError } from '@/lib/errors';

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const input = changePasswordSchema.parse(body);
    await userService.changePassword(session.user.id, input);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues } },
        { status: 400 }
      );
    }
    if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Password change failed' } },
      { status: 500 }
    );
  }
}