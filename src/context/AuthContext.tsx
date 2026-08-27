import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, Company } from '../types';
import { initialCompanies } from '../data/seedData';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  currentCompany: Company;
  isAuthenticated: boolean;
  switchDemoUser: (role: UserRole) => void;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

const mockBuyerUser: UserProfile = {
  id: 'user-buyer-1',
  companyId: 'comp-buyer-1',
  companyName: 'Apex Contracting & Fit-Out LLC',
  fullName: 'Tariq Mansour',
  email: 'procurement@apexcontracting.ae',
  phone: '+971 50 492 8812',
  role: 'buyer',
  jobTitle: 'Head of Procurement',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

const mockSupplierUser: UserProfile = {
  id: 'user-supp-1',
  companyId: 'comp-supp-1',
  companyName: 'Al Noor Electrical Trading LLC',
  fullName: 'Rajesh Kumar',
  email: 'sales@alnoorelectrical.ae',
  phone: '+971 50 882 1190',
  role: 'supplier',
  jobTitle: 'Senior Commercial Estimator',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
};

const mockAdminUser: UserProfile = {
  id: 'user-admin-1',
  companyId: 'comp-admin-1',
  companyName: 'SupplySouq Operations Desk',
  fullName: 'Faisal Al Zaabi',
  email: 'admin@supplysouq.ae',
  phone: '+971 4 200 9900',
  role: 'admin',
  jobTitle: 'Marketplace Operations Lead',
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('buyer');
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockBuyerUser);
  const [currentCompany, setCurrentCompany] = useState<Company>(initialCompanies[0]);

  const switchDemoUser = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'buyer') {
      setCurrentUser(mockBuyerUser);
      const comp = initialCompanies.find(c => c.id === 'comp-buyer-1') || initialCompanies[0];
      setCurrentCompany(comp);
    } else if (newRole === 'supplier') {
      setCurrentUser(mockSupplierUser);
      const comp = initialCompanies.find(c => c.id === 'comp-supp-1') || initialCompanies[2];
      setCurrentCompany(comp);
    } else {
      setCurrentUser(mockAdminUser);
      setCurrentCompany({
        id: 'comp-admin-1',
        name: 'SupplySouq Marketplace Authority',
        legalName: 'SupplySouq FZCO',
        tradeLicenseNumber: 'DSO-FZ-9921',
        companyType: 'both',
        emirate: 'Dubai',
        industrialZone: 'Dubai Silicon Oasis',
        address: 'DSO HQ, Office 1002',
        phone: '+971 4 200 9900',
        email: 'ops@supplysouq.ae',
        categories: ['All UAE Verticals'],
        serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
        verificationStatus: 'verified',
        rating: 5.0,
        reviewCount: 120,
        responseRatePercent: 100,
        averageResponseHours: 0.5,
        yearsInBusiness: 5,
        badge: 'Verified Trader',
        createdAt: '2023-01-01T00:00:00Z'
      });
    }
  };

  const setRole = (newRole: UserRole) => {
    switchDemoUser(newRole);
  };

  const login = (_email: string, targetRole: UserRole) => {
    switchDemoUser(targetRole);
  };

  const logout = () => {
    switchDemoUser('buyer');
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        currentCompany,
        isAuthenticated: true,
        switchDemoUser,
        login,
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
