import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for saved user on app start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      } catch (error) {
        // If saved user data is corrupted, clear it
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple demo validation
      const validCredentials = [
        { email: 'admin@example.com', password: 'admin123', role: 'admin' },
        { email: 'manager@example.com', password: 'manager123', role: 'manager' },
        { email: 'user@example.com', password: 'user123', role: 'user' }
      ];
      
      const validUser = validCredentials.find(
        cred => cred.email === email && cred.password === password
      );
      
      if (!validUser) {
        throw new Error('Invalid email or password');
      }
      
      // Create user data
      const userData = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: validUser.role,
        permissions: getUserPermissions(validUser.role),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(userData));
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, name) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now().toString(),
        email,
        name,
        role: 'user',
        permissions: getUserPermissions('user'),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(userData));
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUserRole = (userId, newRole) => {
    if (state.user && hasPermission('manage_users')) {
      const updatedUser = {
        ...state.user,
        role: newRole,
        permissions: getUserPermissions(newRole)
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    }
  };

  const hasPermission = (permission) => {
    return state.user?.permissions?.includes(permission) || false;
  };

  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUserRole,
    hasPermission,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const getUserPermissions = (role) => {
  const permissions = {
    admin: [
      'create_survey',
      'edit_survey',
      'delete_survey',
      'view_analytics',
      'manage_users',
      'export_data',
      'view_all_surveys',
      'publish_survey'
    ],
    manager: [
      'create_survey',
      'edit_survey',
      'delete_survey',
      'view_analytics',
      'export_data',
      'view_team_surveys',
      'publish_survey'
    ],
    user: [
      'create_survey',
      'edit_survey',
      'view_analytics',
      'view_own_surveys'
    ]
  };
  
  return permissions[role] || permissions.user;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};