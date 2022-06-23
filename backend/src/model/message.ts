export class Message {
  constructor(public name: string, public email: string, public text: string) {}

  public static async create(
    name: string,
    email: string,
    text: string
  ): Promise<Message> {
    return new Message(name, email, text);
  }
}
