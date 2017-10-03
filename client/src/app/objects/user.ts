export class User {
  public _id: string;
  public first_name: string;
  public last_name: string;
  public email: string;
  public username: string;
  public password: string;
  public avatar: string;
  public friends_list: Array<any>;
      public thought = {
      author: String,
      content: String,
      img:String
    }
}
