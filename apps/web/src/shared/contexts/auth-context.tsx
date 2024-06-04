'use client';

import { createContext, useState } from 'react';
import { LS_AUTH_KEY } from '@/shared/constants/localstorage-auth-token-key';
import {
  ValidationMessage,
  groupValidationMessagesFromApi,
} from '@/shared/lib/group-validation-messages-from-api';
import { LoginData } from '@/shared/schemas/user-schema';
import { accessTokenResponseSchema } from '@/shared/schemas/jwt-schema';
import { fetchClient } from '@/shared/lib/fetch-client';

type AuthContextType = {
  username: string;
  isLoading: boolean;
  accessToken: string;
  login: (
    userData: LoginData
  ) => Promise<ValidationMessage<LoginData> | void | string>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [username, setUsername] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = async (userData: LoginData) => {
    setIsLoading(true);
    try {
      const response = await fetchClient('/auth', {
        method: 'POST',
        body: userData,
      });
      const jsonData = await response.json();

      setIsLoading(false);

      const validResponse = accessTokenResponseSchema.safeParse(jsonData);

      if (!validResponse.success) {
        return groupValidationMessagesFromApi<LoginData>(jsonData.message);
      }

      setUsername(userData.login);
      setAccessToken(validResponse.data.access_token);
      localStorage.setItem(LS_AUTH_KEY, validResponse.data.access_token);
    } catch (e) {
      setIsLoading(false);
      return console.log(`something wrong happened: ${e}`);
    }
  };

  const logout = () => {
    setUsername('');
    setAccessToken('');
    localStorage.removeItem(LS_AUTH_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        accessToken,
        username,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider };
