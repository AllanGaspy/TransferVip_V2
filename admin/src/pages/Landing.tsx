import React from 'react'

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-sm p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Transfer VIP Admin</h1>
        <p className="text-gray-600">Este servidor é dedicado ao painel administrativo.</p>
        <div className="space-y-2">
          <a href="/admin/login" className="inline-block px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Entrar no Admin</a>
          <div className="text-sm text-gray-500">Home pública:
            <a href="http://localhost:3002/" className="ml-1 text-blue-600 hover:text-blue-700">http://localhost:3002/</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
