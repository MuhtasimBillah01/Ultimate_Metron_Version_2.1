import { create } from 'zustand';
import { SystemStatus } from './types';

// Define User Role Type
export type UserRole = 'admin' | 'user' | 'guest';

interface AppState {
    isAuthenticated: boolean;
    token: string | null;
    userRole: UserRole | null;

    darkMode: boolean;
    systemStatus: SystemStatus;

    // Actions
    login: (token?: string, role?: UserRole) => void;
    logout: () => void;
    toggleDarkMode: () => void;
    updateSystemStatus: (status: Partial<SystemStatus>) => void;
    triggerKillSwitch: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Initial State
    isAuthenticated: localStorage.getItem('metron_session') === 'active',
    token: localStorage.getItem('metron_token'),
    userRole: localStorage.getItem('metron_role') as UserRole | null,

    darkMode: true,
    systemStatus: {
        cpuUsage: 12,
        ramUsage: 45,
        apiLatency: 45,
        vmStatus: 'Running',
        connectionStatus: 'Connected'
    },

    // Actions
    login: (token = 'mock-jwt-token', role = 'admin') => {
        localStorage.setItem('metron_session', 'active');
        localStorage.setItem('metron_token', token);
        localStorage.setItem('metron_role', role);
        set({ isAuthenticated: true, token, userRole: role });
    },

    logout: () => {
        localStorage.removeItem('metron_session');
        localStorage.removeItem('metron_token');
        localStorage.removeItem('metron_role');
        set({ isAuthenticated: false, token: null, userRole: null });
    },

    toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

    updateSystemStatus: (newStatus) => set((state) => ({
        systemStatus: { ...state.systemStatus, ...newStatus }
    })),

    triggerKillSwitch: () => {
        // In a real app, this calls /api/stop
        alert("🚨 KILL SWITCH ACTIVATED: ALL TRADING HALTED, POSITIONS CLOSING...");
        console.error("KILL SWITCH TRIGGERED");
    }
}));
