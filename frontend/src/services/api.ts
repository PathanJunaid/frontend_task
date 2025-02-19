import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { ApiResponse, ChatMessage, Group, GroupMessageInterface, User } from "../types";

const baseUrl = import.meta.env.VITE_API_URL

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // Access the state from Redux
      const token = (getState() as RootState).auth.accessToken;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    me: builder.mutation<ApiResponse<User>, void>({
      query: () => `/users/me`,
    }),
    getallUsers: builder.mutation<ApiResponse<User[]>, void>({
      query : ()=>{
        return {url: '/users', method: 'GET'}
      }
    }),
    login: builder.mutation<ApiResponse<{ accessToken: string, refreshToken: string }>, { email: string, password: string }>({
      query: (body) => {
        return { url: `/users/login`, method: 'POST', body }
      },
    }),
    register: builder.mutation<ApiResponse<User>, Omit<User, '_id' | 'active' | 'role'> & { confirmPassword: string }>({
      query: (body) => {
        return { url: `/users`, method: 'POST', body }
      },
    }),
    updateUser: builder.mutation<ApiResponse<User>, User>({
      query: (body) => {
        return { url: `/users/${body.id}`, method: 'PUT', body }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => {
        return { url: `/users/logout`, method: 'POST', }
      },
    }),
    getGroups: builder.mutation<ApiResponse<Group[]>, void>({
      query: () => {
        return { url: `/users/chat/group`, method: 'GET', }
      },
    }),
    createGroup: builder.mutation<void, { name: string, description: string, members: string[] }>({
      query: (body) => {
        return { url: `/users/chat/group`, method: 'POST', body }
      },
    }),
    CreateChat: builder.mutation<{}, { recieverEmail: string, msg: string }>({
      query: (body) => {
        return { url: `/users/chat`, method: 'POST', body }
      }
    }),

    getChats : builder.mutation<ApiResponse<ChatMessage[]>, void>({
      query : () =>{
        return { url: `/users/chat/get`, method: 'GET'}
      }
    }),
    sendMsg : builder.mutation<ApiResponse<ChatMessage>, {msg: string, recieverEmail: string}>({
      query: (body)=>{
        return {url : '/users/chat/', method: 'POST', body}
      }
    }),
    getGroupChats : builder.mutation<ApiResponse<GroupMessageInterface[]>, {id: string}>({
      query : (body) =>{
        return { url: `/users/chat/group/${body.id}`, method: 'GET'}
      }
    }),
    sendGroupMsg : builder.mutation<ApiResponse<GroupMessageInterface>, {id: string, email: string, msg: string }>({
      query : (body)=>{
        return {url : `/users/chat/group/${body.id}`, method: 'POST', body: {email: body.email, msg: body.msg}}
      }
    }),
    getMemebers: builder.mutation<ApiResponse<Group>, {id: string}>({
      query: (body)=>{
        return {url: `/users/chat/group/member/${body.id}`, method: 'GET'}
      }
    })

  }),
});

export const { useMeMutation, useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateUserMutation, useGetGroupsMutation, useCreateGroupMutation, useCreateChatMutation, useGetChatsMutation,
  useSendMsgMutation,
  useGetGroupChatsMutation,
  useSendGroupMsgMutation,
  useGetallUsersMutation,
  useGetMemebersMutation
 } = api;
