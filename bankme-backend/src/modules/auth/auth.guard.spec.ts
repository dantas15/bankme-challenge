import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';
import { createMock } from '../../helpers/createMock';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

const mockJwtSecret = 'jwt_secret';
jest.mock('../../config/auth.config', () => ({
  jwtConfig: {
    secret: 'jwt_secret', // it had to be hardcoded because there was a ReferenceError when using the const
  },
}));

describe('AuthGuard', () => {
  let jwtService: JwtService;
  let reflector: Reflector;
  let guard: AuthGuard;
  let context: ExecutionContext;

  beforeAll(() => {});

  beforeEach(() => {
    reflector = new Reflector();
    jwtService = new JwtService({
      global: true,
      secret: mockJwtSecret,
      signOptions: { expiresIn: '1m' },
    });
    guard = new AuthGuard(jwtService, reflector);
    context = mockEmptyContext();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow access if IS_SKIP_AUTH_KEY is set', async () => {
      reflector.getAllAndOverride = jest.fn().mockReturnValue(true); // verifies that SkipAuth is present

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException if no token is present', async () => {
      const request: Partial<Request> = {
        headers: {},
      };
      context.switchToHttp = jest.fn().mockReturnValue({
        getRequest: () => request,
      });

      reflector.getAllAndOverride = jest.fn().mockReturnValue(false); // SkipAuth is not present
      jest.spyOn(context.switchToHttp(), 'getRequest');
      jest.spyOn(jwtService, 'verifyAsync');

      await guard.canActivate(context).catch((exception) => {
        expect(exception).toBeInstanceOf(UnauthorizedException);
      });
      expect(context.switchToHttp().getRequest).toHaveBeenCalled();
      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const request: Partial<Request> = {
        headers: {
          authorization: 'Bearer invalid_token',
        },
      };
      context.switchToHttp = jest.fn().mockReturnValue({
        getRequest: () => request,
      });

      reflector.getAllAndOverride = jest.fn().mockReturnValue(false); // SkipAuth is not present
      jest.spyOn(context.switchToHttp(), 'getRequest');
      jest.spyOn(jwtService, 'verifyAsync');

      await guard.canActivate(context).catch((exception) => {
        expect(exception).toBeInstanceOf(UnauthorizedException);
      });
      expect(context.switchToHttp().getRequest).toHaveBeenCalled();
      expect(jwtService.verifyAsync).toHaveBeenCalled();
    });

    it('should allow access if token is valid', async () => {
      const validToken = 'valid_token';
      const request: Partial<Request> = {
        headers: {
          authorization: `Bearer ${validToken}`,
        },
      };
      context.switchToHttp = jest.fn().mockReturnValue({
        getRequest: () => request,
      });

      reflector.getAllAndOverride = jest.fn().mockReturnValue(false); // SkipAuth is not present
      jest.spyOn(context.switchToHttp(), 'getRequest');
      jwtService.verifyAsync = jest.fn().mockReturnValue(Promise.resolve(true));

      const result = await guard.canActivate(context);
      expect(context.switchToHttp().getRequest).toHaveBeenCalled();
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(validToken, {
        secret: mockJwtSecret,
      });
      expect(result).toBe(true);
    });
  });
});

function mockEmptyContext() {
  const context = createMock<ExecutionContext>();
  // the following functions will be passed to getAllAndOverride
  // since we're mocking the return value of the function there's
  // no need to implement these.
  // so basically these 2 lines are to prevent type errors :)
  context.getHandler = jest.fn();
  context.getClass = jest.fn();
  return context;
}
