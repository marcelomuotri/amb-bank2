import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface DashboardData {
  status: string;
  total_available: number;
  files_available: number;
  used_this_month: number;
  renews_on: string;
  plan_name: string;
  unlimited: boolean;
  percentage_used: number;
  organization_id: string;
  current_month: string;
  block_transactions: boolean;
  subscription_status: string;
}

interface DashboardContextType {
  dashboardData: DashboardData | null;
  setDashboardData: (data: DashboardData | null) => void;
  updateUsedFiles: (count: number) => void;
  refreshDashboard: () => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  const updateUsedFiles = useCallback((count: number) => {
    if (dashboardData) {
      setDashboardData({
        ...dashboardData,
        used_this_month: dashboardData.used_this_month + count,
        files_available: dashboardData.files_available - count,
      });
    }
  }, [dashboardData]);

  const refreshDashboard = useCallback(async () => {
    // Esta función se puede usar para refrescar los datos del dashboard
    // Por ahora la dejamos vacía, se puede implementar más tarde
  }, []);

  return (
    <DashboardContext.Provider value={{
      dashboardData,
      setDashboardData,
      updateUsedFiles,
      refreshDashboard,
      loading,
      setLoading,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}; 