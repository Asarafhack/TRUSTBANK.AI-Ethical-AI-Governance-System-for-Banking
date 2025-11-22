import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { authService } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import CustomerDashboard from "./pages/customer/Dashboard";
import LoanApply from "./pages/customer/LoanApply";
import ConsentManagement from "./pages/customer/ConsentManagement";
import ProfileView from "./pages/customer/ProfileView";
import TransactionHistory from "./pages/customer/TransactionHistory";
import IncidentReport from "./pages/customer/IncidentReport";
import LoanTracker from "./pages/customer/LoanTracker";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DecisionLogs from "./pages/admin/DecisionLogs";
import FairnessAnalysis from "./pages/admin/FairnessAnalysis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    authService.initializeDemo();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Customer Routes */}
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/loan-apply"
              element={
                <ProtectedRoute requiredRole="customer">
                  <LoanApply />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/consent"
              element={
                <ProtectedRoute requiredRole="customer">
                  <ConsentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/profile"
              element={
                <ProtectedRoute requiredRole="customer">
                  <ProfileView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/transactions"
              element={
                <ProtectedRoute requiredRole="customer">
                  <TransactionHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/incident-report"
              element={
                <ProtectedRoute requiredRole="customer">
                  <IncidentReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/loan-tracker"
              element={
                <ProtectedRoute requiredRole="customer">
                  <LoanTracker />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/decisions"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DecisionLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/fairness"
              element={
                <ProtectedRoute requiredRole="admin">
                  <FairnessAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DecisionLogs />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
