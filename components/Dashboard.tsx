'use client';

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { TrendingUp, Users, DollarSign, Package, AlertTriangle, ChefHat } from 'lucide-react';
import { format } from 'date-fns';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState({
    activeOrders: 0,
    occupiedTables: 0,
    todayRevenue: 0,
    lowStockItems: 0,
    pendingKOT: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const updateStats = () => {
      const orders = store.getActiveOrders();
      const tables = store.getTables();
      const inventory = store.getLowStockItems();
      const allOrders = store.getOrders();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = allOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime() && order.status === 'completed';
      });

      const revenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

      const pendingItems = orders.reduce((count, order) => {
        return count + order.items.filter(item => item.status === 'pending').length;
      }, 0);

      setStats({
        activeOrders: orders.length,
        occupiedTables: tables.filter(t => t.status === 'occupied').length,
        todayRevenue: revenue,
        lowStockItems: inventory.length,
        pendingKOT: pendingItems,
      });

      setRecentOrders(allOrders.slice(-5).reverse());
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeOrders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Occupied Tables</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.occupiedTables}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">${stats.todayRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onNavigate('inventory')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.lowStockItems}</p>
            </div>
            <div className={`p-3 rounded-full ${stats.lowStockItems > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
              <Package className={stats.lowStockItems > 0 ? 'text-red-600' : 'text-gray-600'} size={24} />
            </div>
          </div>
          {stats.lowStockItems > 0 && (
            <div className="mt-2 flex items-center text-red-600 text-sm">
              <AlertTriangle size={16} className="mr-1" />
              Requires attention
            </div>
          )}
        </div>

        <div
          className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onNavigate('kot')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending KOT</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingKOT}</p>
            </div>
            <div className={`p-3 rounded-full ${stats.pendingKOT > 0 ? 'bg-orange-100' : 'bg-gray-100'}`}>
              <ChefHat className={stats.pendingKOT > 0 ? 'text-orange-600' : 'text-gray-600'} size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waiter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No orders yet. Create your first order!
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">Table {order.tableNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.waiterName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.items.length} items</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(order.createdAt), 'h:mm a')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigate('waiter')}
          className="bg-primary-600 text-white rounded-lg p-6 hover:bg-primary-700 transition-colors text-left"
        >
          <h3 className="text-lg font-semibold mb-2">New Order</h3>
          <p className="text-primary-100 text-sm">Start taking a new order</p>
        </button>

        <button
          onClick={() => onNavigate('tables')}
          className="bg-white border-2 border-primary-600 text-primary-600 rounded-lg p-6 hover:bg-primary-50 transition-colors text-left"
        >
          <h3 className="text-lg font-semibold mb-2">Manage Tables</h3>
          <p className="text-gray-600 text-sm">View and manage table status</p>
        </button>

        <button
          onClick={() => onNavigate('menu')}
          className="bg-white border-2 border-primary-600 text-primary-600 rounded-lg p-6 hover:bg-primary-50 transition-colors text-left"
        >
          <h3 className="text-lg font-semibold mb-2">Update Menu</h3>
          <p className="text-gray-600 text-sm">Add or edit menu items</p>
        </button>
      </div>
    </div>
  );
}
