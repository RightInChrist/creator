"use client";

import { createContext, useContext, ReactNode } from 'react';
import { Account, Project } from '@/types';

interface AccountContextType {
  currentAccount: Account;
  currentProject: Project;
}

// Default account and project
const defaultAccount: Account = {
  id: 'default',
  name: 'Default Account',
  createdAt: Date.now(),
};

const defaultProject: Project = {
  id: 'default',
  accountId: 'default',
  name: 'Default Project',
  description: 'Default project for requirements gathering',
  createdAt: Date.now(),
};

const AccountContext = createContext<AccountContextType>({
  currentAccount: defaultAccount,
  currentProject: defaultProject,
});

export function AccountProvider({ children }: { children: ReactNode }) {
  // For now, we'll just use the default account and project
  // Later, this can be expanded to fetch from an API and manage multiple accounts/projects
  return (
    <AccountContext.Provider
      value={{
        currentAccount: defaultAccount,
        currentProject: defaultProject,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
} 