declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

interface User {
  _id: string;
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