import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import RulesPage from './pages/RulesPage'
import AnalyticsPage from './pages/AnalyticsPage'
import CompetitorsPage from './pages/CompetitorsPage'
import AlertsPage from './pages/AlertsPage'
import AIAssistantPage from './pages/AIAssistantPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/auth/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import { useAuthStore } from './store/authStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="competitors" element={<CompetitorsPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="ai" element={<AIAssistantPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}