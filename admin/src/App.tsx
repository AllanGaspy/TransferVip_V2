import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import ServicosList from './pages/servicos/ServicosList'
import ServicoForm from './pages/servicos/ServicoForm'
import VeiculosList from './pages/veiculos/VeiculosList'
import VeiculoForm from './pages/veiculos/VeiculoForm'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <Layout>{children}</Layout>
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/servicos"
            element={
              <ProtectedRoute>
                <ServicosList />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/servicos/novo"
            element={
              <ProtectedRoute>
                <ServicoForm />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/servicos/:id/editar"
            element={
              <ProtectedRoute>
                <ServicoForm />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/veiculos"
            element={
              <ProtectedRoute>
                <VeiculosList />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/veiculos/novo"
            element={
              <ProtectedRoute>
                <VeiculoForm />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/veiculos/:id/editar"
            element={
              <ProtectedRoute>
                <VeiculoForm />
              </ProtectedRoute>
            }
          />
          
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
