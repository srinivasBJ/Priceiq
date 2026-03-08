import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import AppLayout from "./components/layout/AppLayout"

const DashboardPage = lazy(() => import("./pages/DashboardPage"))
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"))
const SettingsPage = lazy(() => import("./pages/SettingsPage"))
const CatalogPage = lazy(() => import("./pages/CatalogPage"))
const SearchPage = lazy(() => import("./pages/SearchPage"))
const DealsPage = lazy(() => import("./pages/DealsPage"))
const ComparePage = lazy(() => import("./pages/ComparePage"))
const WishlistPage = lazy(() => import("./pages/WishlistPage"))
const PriceTrackerPage = lazy(() => import("./pages/PriceTrackerPage"))
const LoginPage = lazy(() => import("./pages/auth/LoginPage"))
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: "20px", fontFamily: "var(--mono)", color: "var(--text-muted)" }}>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage />} />
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="catalog/search" element={<SearchPage />} />
            <Route path="deals" element={<DealsPage />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="tracker" element={<PriceTrackerPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
