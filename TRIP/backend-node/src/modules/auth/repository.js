import { BaseRepository } from '../../firestore/repository.js';

class AuthRepositoryClass extends BaseRepository {
  constructor() {
    super('users');
  }
}

export const AuthRepository = new AuthRepositoryClass();
