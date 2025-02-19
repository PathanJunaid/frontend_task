declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
interface Base {
  createdAt: Date,
  updatedAt: Date,
  iat: number
}
interface User extends Base{
  id: string;
  name: string;
  email: string;
  active: boolean;
  role: "USER" | "ADMIN";
}

interface ApiResponse<T> {
  data: T;
  message: string;
  sucess: boolean
}
export interface Group {
  id: string;
  name: string;
  description: string;
  private: boolean;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  admin: {
    id: string;
    name: string;
    email: string;
    password: string;
    active: boolean;
  };
  members: any[];
}
interface ChatMessage {
  id: string;
  fromEmail: string;
  toEmail: string;
  message: string;
  Status: string;
  createdAt: string;  // Alternatively, you can use Date if you want to work with Date objects.
}
export interface GroupMessageInterface {
  id: string;
  fromId: string;
  toId: string;
  message: string;
  createdAt: string; // ISO date string
}
