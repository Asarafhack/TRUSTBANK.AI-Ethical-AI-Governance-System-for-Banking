import { User } from '@/types';

const USERS_KEY = 'trustbank_users';
const CURRENT_USER_KEY = 'trustbank_current_user';

export const authService = {
  signup: (email: string, password: string, name: string, role: 'customer' | 'admin' = 'customer'): User => {
    const users = authService.getAllUsers();
    
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      role,
      name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return newUser;
  },

  login: (email: string, password: string): User => {
    const users = authService.getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  getAllUsers: (): User[] => {
    const usersStr = localStorage.getItem(USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  },

  initializeDemo: () => {
    const users = authService.getAllUsers();
    if (users.length === 0) {
      // Create demo admin
      authService.signup('admin@trustbank.ai', 'admin123', 'Admin User', 'admin');
      // Create demo customer
      authService.signup('customer@demo.com', 'demo123', 'John Doe', 'customer');
    }
  }
};
