'use client';

import { useState } from 'react';
import { LayoutDashboard, Utensils, Table2, Package, BookOpen, ChefHat, User } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import TableManagement from '@/components/TableManagement';
import OrderManagement from '@/components/OrderManagement';
import MenuManagement from '@/components/MenuManagement';
import InventoryManagement from '@/components/InventoryManagement';
import RecipeManagement from '@/components/RecipeManagement';
import KOTDisplay from '@/components/KOTDisplay';
import WaiterMode from '@/components/WaiterMode';

type ViewMode = 'dashboard' | 'tables' | 'orders' | 'menu' | 'inventory' | 'recipes' | 'kot' | 'waiter';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  const handleNavigate = (view: string) => {
    setCurrentView(view as ViewMode);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'tables':
        return <TableManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'menu':
        return <MenuManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'recipes':
        return <RecipeManagement />;
      case 'kot':
        return <KOTDisplay />;
      case 'waiter':
        return <WaiterMode />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600">Cafe POS</h1>
          <p className="text-sm text-gray-500">Management System</p>
        </div>

        <nav className="mt-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              currentView === 'dashboard' ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('tables')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              currentView === 'tables' ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Table2 size={20} />
            <span>Tables</span>
          </button>

          <button
            onClick={() => setCurrentView('orders')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              currentView === 'orders' ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Utensils size={20} />
            <span>Orders</span>
          </button>

          <button
            onClick={() => setCurrentView('menu')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              currentView === 'menu' ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BookOpen size={20} />
            <span>Menu</span>
          </button>

          <button
            onClick={() => setCurrentView('inventory')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              currentView === 'inventory' ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Package size={20} />
            <span>Inventory</span>
          </button>

          <button
            onClick={() => setCurrentView('recipes')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              currentView === 'recipes' ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ChefHat size={20} />
            <span>Recipes</span>
          </button>

          <div className="my-4 border-t border-gray-200"></div>

          <button
            onClick={() => setCurrentView('kot')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              currentView === 'kot' ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ChefHat size={20} />
            <span>KOT Display</span>
          </button>

          <button
            onClick={() => setCurrentView('waiter')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              currentView === 'waiter' ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <User size={20} />
            <span>Waiter Mode</span>
          </button>
        </nav>
      </aside>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center py-2 px-4 ${currentView === 'dashboard' ? 'text-primary-600' : 'text-gray-600'}`}
          >
            <LayoutDashboard size={20} />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentView('waiter')}
            className={`flex flex-col items-center py-2 px-4 ${currentView === 'waiter' ? 'text-primary-600' : 'text-gray-600'}`}
          >
            <User size={20} />
            <span className="text-xs mt-1">Waiter</span>
          </button>
          <button
            onClick={() => setCurrentView('kot')}
            className={`flex flex-col items-center py-2 px-4 ${currentView === 'kot' ? 'text-primary-600' : 'text-gray-600'}`}
          >
            <ChefHat size={20} />
            <span className="text-xs mt-1">Kitchen</span>
          </button>
          <button
            onClick={() => setCurrentView('menu')}
            className={`flex flex-col items-center py-2 px-4 ${currentView === 'menu' ? 'text-primary-600' : 'text-gray-600'}`}
          >
            <BookOpen size={20} />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {renderView()}
      </main>
    </div>
  );
}
