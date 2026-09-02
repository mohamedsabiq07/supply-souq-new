import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, Company, Emirate, VerificationRequest } from '../types';
import { initialCompanies } from '../data/seedData';
import { supabaseService } from '../services/supabaseService';

export interface BuyerSignupData {
  companyName: string;
  procurementEngineerName: string;
  phone: string;
  email: string;
  address: string;
  emirate: Emirate;
  password?: string;
}

export interface SupplierSignupData {
  companyName: string;
  legalName?: string;
  tradeLicenseNumber: string;
  tradeLicenseDocUrl?: string;
  contactPersonName: string;
  phone: string;
  email: string;
  address: string;
  emirate: Emirate;
  industrialZone: string;
  categories: string[];
  password?: string;
}

export interface GuestProfile extends UserProfile {}

export const guestUser: UserProfile = {
  id: '',
  companyId: '',
  companyName: '',
  fullName: '',
  email: '',
  phone: '',
  role: 'buyer',
  jobTitle: '',
  emirate: 'Dubai',
  address: '',
  verificationStatus: 'verified',
  createdAt: ''
};

export const guestCompany: Company = {
  id: '',
  name: '',
  legalName: '',
  tradeLicenseNumber: '',
  companyType: 'buyer',
  emirate: 'Dubai',
  industrialZone: '',
  address: '',
  phone: '',
  email: '',
  categories: [],
  serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
  verificationStatus: 'verified',
  rating: 5,
  reviewCount: 0,
  responseRatePercent: 100,
  averageResponseHours: 1,
  yearsInBusiness: 1,
  createdAt: ''
};

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  currentCompany: Company;
  isAuthenticated: boolean;
  isAdmin: boolean;
  registeredUsers: UserProfile[];
  switchDemoUser: (role: UserRole) => void;
  login: (email: string, role: UserRole) => void;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (password: string) => boolean;
  signUpBuyer: (data: BuyerSignupData) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  signUpSupplier: (data: SupplierSignupData) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  logout: () => void;
}

export const mockBuyerUser: UserProfile = {
  id: 'user-buyer-1',
  companyId: 'comp-buyer-1',
  companyName: 'Apex MEP & General Contracting LLC',
  fullName: 'Eng. Tariq Mansour',
  email: 'procurement@apexcontracting.ae',
  phone: '+971 50 492 8812',
  role: 'buyer',
  jobTitle: 'Head of Procurement',
  emirate: 'Dubai',
  address: 'Bay Square Building 7, Business Bay, Dubai',
  verificationStatus: 'verified',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: '2024-02-15T10:00:00Z'
};

export const mockSupplierUser: UserProfile = {
  id: 'user-supp-1',
  companyId: 'comp-supp-1',
  companyName: 'Al Noor Electrical Trading LLC',
  fullName: 'Rajesh Kumar',
  email: 'sales@alnoorelectrical.ae',
  phone: '+971 50 882 1190',
  role: 'supplier',
  jobTitle: 'Senior Commercial Estimator',
  tradeLicenseNumber: 'TL-551029',
  emirate: 'Dubai',
  industrialZone: 'Al Quoz Industrial Area 3',
  address: 'Street 8, Warehouse 12, Al Quoz 3, Dubai',
  verificationStatus: 'verified',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  createdAt: '2023-01-20T09:00:00Z'
};

export const mockAdminUser: UserProfile = {
  id: 'user-admin-1',
  companyId: 'comp-admin-1',
  companyName: 'SupplySouq Operations Desk',
  fullName: 'SupplySouq Operator',
  email: 'admin@supplysouq.ae',
  phone: '+971 4 200 9900',
  role: 'admin',
  jobTitle: 'Marketplace Operations Lead',
  emirate: 'Dubai',
  address: 'DSO HQ, Office 1002, Dubai',
  verificationStatus: 'verified',
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  createdAt: '2023-01-01T00:00:00Z'
};

const defaultUsers: UserProfile[] = [mockBuyerUser, mockSupplierUser, mockAdminUser];

const AUTH_STORAGE_KEY = 'supplysouq_auth_session_v10';
const USERS_STORAGE_KEY = 'supplysouq_registered_users_v10';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem(`${AUTH_STORAGE_KEY}_is_auth`);
      return savedAuth === 'true';
    } catch (e) {
      return false;
    }
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(`${AUTH_STORAGE_KEY}_role`);
      if (saved === 'buyer' || saved === 'supplier' || saved === 'admin') return saved;
    } catch (e) {}
    return 'buyer';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const savedAuth = localStorage.getItem(`${AUTH_STORAGE_KEY}_is_auth`);
      const saved = localStorage.getItem(`${AUTH_STORAGE_KEY}_user`);
      if (savedAuth === 'true' && saved) return JSON.parse(saved);
    } catch (e) {}
    return guestUser;
  });

  const [currentCompany, setCurrentCompany] = useState<Company>(() => {
    try {
      const savedAuth = localStorage.getItem(`${AUTH_STORAGE_KEY}_is_auth`);
      const saved = localStorage.getItem(`${AUTH_STORAGE_KEY}_company`);
      if (savedAuth === 'true' && saved) return JSON.parse(saved);
    } catch (e) {}
    return guestCompany;
  });

  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultUsers;
  });

  // Sync users from Supabase on mount
  useEffect(() => {
    supabaseService.fetchUsers().then((cloudUsers) => {
      if (cloudUsers && cloudUsers.length > 0) {
        setRegisteredUsers((prev) => {
          const merged = [...prev];
          cloudUsers.forEach((cu) => {
            const idx = merged.findIndex((u) => u.id === cu.id || u.email === cu.email);
            if (idx >= 0) merged[idx] = cu;
            else merged.push(cu);
          });
          return merged;
        });
      }
    }).catch(console.error);
  }, []);

  // Persist or clear session
  useEffect(() => {
    try {
      if (isAuthenticated && currentUser.id && currentCompany.id) {
        localStorage.setItem(`${AUTH_STORAGE_KEY}_is_auth`, 'true');
        localStorage.setItem(`${AUTH_STORAGE_KEY}_role`, role);
        localStorage.setItem(`${AUTH_STORAGE_KEY}_user`, JSON.stringify(currentUser));
        localStorage.setItem(`${AUTH_STORAGE_KEY}_company`, JSON.stringify(currentCompany));
      } else {
        localStorage.removeItem(`${AUTH_STORAGE_KEY}_is_auth`);
        localStorage.removeItem(`${AUTH_STORAGE_KEY}_role`);
        localStorage.removeItem(`${AUTH_STORAGE_KEY}_user`);
        localStorage.removeItem(`${AUTH_STORAGE_KEY}_company`);
      }
    } catch (e) {}
  }, [isAuthenticated, role, currentUser, currentCompany]);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));
    } catch (e) {}
  }, [registeredUsers]);

  const switchDemoUser = (newRole: UserRole) => {
    setRoleState(newRole);
    setIsAuthenticated(true);
    if (newRole === 'buyer') {
      setCurrentUser(mockBuyerUser);
      const comp = initialCompanies.find((c) => c.id === 'comp-buyer-1') || initialCompanies[0];
      setCurrentCompany(comp);
    } else if (newRole === 'supplier') {
      setCurrentUser(mockSupplierUser);
      const comp = initialCompanies.find((c) => c.id === 'comp-supp-1') || initialCompanies[2];
      setCurrentCompany(comp);
    } else {
      setCurrentUser(mockAdminUser);
      setCurrentCompany({
        id: 'comp-admin-1',
        name: 'SupplySouq Operations Desk',
        legalName: 'SupplySouq FZCO',
        tradeLicenseNumber: 'DSO-FZ-9921',
        companyType: 'both',
        emirate: 'Dubai',
        industrialZone: 'Dubai Silicon Oasis',
        address: 'DSO HQ, Office 1002, Dubai',
        phone: '+971 4 200 9900',
        email: 'admin@supplysouq.ae',
        categories: ['All UAE Verticals'],
        serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
        verificationStatus: 'verified',
        rating: 5.0,
        reviewCount: 120,
        responseRatePercent: 100,
        averageResponseHours: 0.5,
        yearsInBusiness: 5,
        badge: 'Verified Trader',
        createdAt: '2023-01-01T00:00:00Z',
      });
    }
  };

  const setRole = (newRole: UserRole) => {
    switchDemoUser(newRole);
  };

  const login = (email: string, targetRole: UserRole) => {
    const found = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setRoleState(found.role);
      setIsAuthenticated(true);
      const comp = initialCompanies.find((c) => c.id === found.companyId) || {
        id: found.companyId,
        name: found.companyName,
        legalName: found.companyName,
        tradeLicenseNumber: found.tradeLicenseNumber || 'TL-PENDING',
        companyType: found.role === 'supplier' ? 'supplier' : 'buyer',
        emirate: found.emirate || 'Dubai',
        industrialZone: found.industrialZone || 'Al Quoz Industrial Area',
        address: found.address || 'Dubai, UAE',
        phone: found.phone,
        email: found.email,
        categories: ['LV & MV Power Cables & Wires', 'Switchgear, MCBs & Distribution Boards'],
        serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
        verificationStatus: found.verificationStatus || 'verified',
        rating: 5.0,
        reviewCount: 1,
        responseRatePercent: 100,
        averageResponseHours: 1.0,
        yearsInBusiness: 2,
        createdAt: found.createdAt || new Date().toISOString(),
      };
      setCurrentCompany(comp);
    } else {
      switchDemoUser(targetRole);
    }
  };

  const signIn = async (email: string, _password?: string): Promise<{ success: boolean; error?: string }> => {
    const found = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setRoleState(found.role);
      setIsAuthenticated(true);
      const comp = initialCompanies.find((c) => c.id === found.companyId) || {
        id: found.companyId,
        name: found.companyName,
        legalName: found.companyName,
        tradeLicenseNumber: found.tradeLicenseNumber || 'TL-PENDING',
        companyType: found.role === 'supplier' ? 'supplier' : 'buyer',
        emirate: found.emirate || 'Dubai',
        industrialZone: found.industrialZone || 'Al Quoz Industrial Area',
        address: found.address || 'Dubai, UAE',
        phone: found.phone,
        email: found.email,
        categories: ['LV & MV Power Cables & Wires', 'Switchgear, MCBs & Distribution Boards'],
        serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
        verificationStatus: found.verificationStatus || 'verified',
        rating: 5.0,
        reviewCount: 1,
        responseRatePercent: 100,
        averageResponseHours: 1.0,
        yearsInBusiness: 2,
        createdAt: found.createdAt || new Date().toISOString(),
      };
      setCurrentCompany(comp);
      return { success: true };
    }

    // Check default mock accounts
    if (email.toLowerCase() === 'procurement@apexcontracting.ae') {
      switchDemoUser('buyer');
      return { success: true };
    }
    if (email.toLowerCase() === 'sales@alnoorelectrical.ae') {
      switchDemoUser('supplier');
      return { success: true };
    }
    if (email.toLowerCase() === 'admin@supplysouq.ae') {
      switchDemoUser('admin');
      return { success: true };
    }

    return { success: false, error: 'No account found with this email. Please check your credentials or create an account.' };
  };

  const adminLogin = (password: string): boolean => {
    if (password === 'admin123' || password === 'supplysouq2026') {
      switchDemoUser('admin');
      return true;
    }
    return false;
  };

  // Buyer Signup
  const signUpBuyer = async (data: BuyerSignupData): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    try {
      const companyId = `comp-buyer-${Date.now()}`;
      const userId = `user-buyer-${Date.now()}`;

      const newCompany: Company = {
        id: companyId,
        name: data.companyName,
        legalName: data.companyName,
        tradeLicenseNumber: 'CN-REGISTERED-' + Math.floor(100000 + Math.random() * 900000),
        companyType: 'buyer',
        emirate: data.emirate,
        industrialZone: 'Commercial Sector',
        address: data.address,
        phone: data.phone,
        email: data.email,
        categories: ['LV & MV Power Cables & Wires', 'Switchgear, MCBs & Distribution Boards', 'Commercial LED Lighting & Fixtures'],
        serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
        verificationStatus: 'verified',
        rating: 5.0,
        reviewCount: 0,
        responseRatePercent: 100,
        averageResponseHours: 1.0,
        yearsInBusiness: 1,
        createdAt: new Date().toISOString(),
      };

      const newUser: UserProfile = {
        id: userId,
        companyId: companyId,
        companyName: data.companyName,
        fullName: data.procurementEngineerName,
        email: data.email,
        phone: data.phone,
        role: 'buyer',
        jobTitle: 'Procurement Engineer',
        emirate: data.emirate,
        address: data.address,
        verificationStatus: 'verified',
        createdAt: new Date().toISOString(),
      };

      // 1. Update State
      setRegisteredUsers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);
      setCurrentCompany(newCompany);
      setRoleState('buyer');

      // 2. Persist to Supabase
      await supabaseService.registerUser({
        user: newUser,
        company: newCompany,
      });

      return { success: true, user: newUser };
    } catch (err: any) {
      console.error('Buyer Signup Error:', err);
      return { success: false, error: err?.message || 'Failed to create account' };
    }
  };

  // Supplier Signup
  const signUpSupplier = async (data: SupplierSignupData): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    try {
      const companyId = `comp-supp-${Date.now()}`;
      const userId = `user-supp-${Date.now()}`;
      const verifId = `verif-${Date.now()}`;

      const newCompany: Company = {
        id: companyId,
        name: data.companyName,
        legalName: data.legalName || data.companyName,
        tradeLicenseNumber: data.tradeLicenseNumber,
        tradeLicenseDocUrl: data.tradeLicenseDocUrl || '/docs/trade-license.pdf',
        companyType: 'supplier',
        emirate: data.emirate,
        industrialZone: data.industrialZone,
        address: data.address,
        phone: data.phone,
        email: data.email,
        categories: data.categories.length > 0 ? data.categories : ['LV & MV Power Cables & Wires'],
        serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
        verificationStatus: 'pending',
        verificationNotes: 'Under compliance team review for Trade License: ' + data.tradeLicenseNumber,
        rating: 5.0,
        reviewCount: 0,
        responseRatePercent: 95,
        averageResponseHours: 2.0,
        yearsInBusiness: 1,
        badge: 'Verified Trader',
        createdAt: new Date().toISOString(),
      };

      const newUser: UserProfile = {
        id: userId,
        companyId: companyId,
        companyName: data.companyName,
        fullName: data.contactPersonName,
        email: data.email,
        phone: data.phone,
        role: 'supplier',
        jobTitle: 'Sales Representative',
        tradeLicenseNumber: data.tradeLicenseNumber,
        tradeLicenseDocUrl: data.tradeLicenseDocUrl,
        emirate: data.emirate,
        address: data.address,
        industrialZone: data.industrialZone,
        verificationStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      const newVerification: VerificationRequest = {
        id: verifId,
        companyId: companyId,
        companyName: data.companyName,
        tradeLicenseNumber: data.tradeLicenseNumber,
        emirate: data.emirate,
        industrialZone: data.industrialZone,
        docUrl: data.tradeLicenseDocUrl || '/docs/trade-license.pdf',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        notes: `New supplier signup from ${data.emirate} (${data.industrialZone}).`,
      };

      // 1. Update State
      setRegisteredUsers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);
      setCurrentCompany(newCompany);
      setRoleState('supplier');

      // 2. Persist to Supabase
      await supabaseService.registerUser({
        user: newUser,
        company: newCompany,
        verification: newVerification,
      });

      return { success: true, user: newUser };
    } catch (err: any) {
      console.error('Supplier Signup Error:', err);
      return { success: false, error: err?.message || 'Failed to register supplier' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(guestUser);
    setCurrentCompany(guestCompany);
    setRoleState('buyer');
    try {
      localStorage.removeItem(`${AUTH_STORAGE_KEY}_is_auth`);
      localStorage.removeItem(`${AUTH_STORAGE_KEY}_role`);
      localStorage.removeItem(`${AUTH_STORAGE_KEY}_user`);
      localStorage.removeItem(`${AUTH_STORAGE_KEY}_company`);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        currentCompany,
        isAuthenticated: !!isAuthenticated && !!currentUser?.id,
        isAdmin: role === 'admin',
        registeredUsers,
        switchDemoUser,
        login,
        signIn,
        adminLogin,
        signUpBuyer,
        signUpSupplier,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
