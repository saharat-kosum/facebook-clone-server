export interface UserType {
  _id: String
  firstName: String
  lastName: String
  email: String
  password: String
  picturePath: String
  friends: Array<Friend>
}

export interface Friend {
  _id: String
  firstName: String
  lastName: String
  picturePath: String
}

export interface ChatHistoryType {
  sender: string;
  receiver: string;
  message: string;
}