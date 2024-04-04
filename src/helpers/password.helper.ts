import { randomBytes, pbkdf2Sync } from "crypto";

export class PasswordHelper {
  static getPasswordData(password: string): { hash: string, salt: string } {

    let salt = this.salt()
    let hash = this.hash(password, salt)

    return { salt, hash }
  }


  private static salt() {
    return randomBytes(20).toString('hex');
  }

  private static hash(password, salt) {
    return pbkdf2Sync(password, salt,
      1000, 64, `sha512`).toString(`hex`);
  }

  static valid(password, salt, hash) {
    return this.hash(password, salt) === hash
  }


}