export class UserId {
  private constructor(public readonly email: string) {}

  static create(email: string): UserId {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    return new UserId(email.toLowerCase());
  }

  equals(other: UserId): boolean {
    return this.email === other.email;
  }
}

