import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const autheticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await autheticateUser.execute({
      email,
      password,
    });

    return response.json({ user: instanceToInstance(user), token });
  }
}
