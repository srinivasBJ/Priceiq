import { BrowserRouter, Routes, Route } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import DashboardPage from "./pages/DashboardPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import SettingsPage from "./pages/SettingsPage"
import CatalogPage from "./pages/CatalogPage"
import SearchPage from "./pages/SearchPage"
import DealsPage from "./pages/DealsPage"
import ComparePage from "./pages/ComparePage"
import WishlistPage from "./pages/WishlistPage"
import PriceTrackerPage from "./pages/PriceTrackerPage"
import LoginPage from "./pages/auth/LoginPage"
import NotFoundPage from "./pages/NotFoundPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
    </BrowserRouter>
  )
}
