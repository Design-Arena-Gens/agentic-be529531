'use client';

import { useEffect, useState } from 'react';
import { store, Order, OrderItem } from '@/lib/store';
import { format } from 'date-fns';
import { Clock, ChefHat, CheckCircle, AlertCircle } from 'lucide-react';

export default function KOTDisplay() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing'>('all');

  useEffect(() => {
    const updateOrders = () => {
      setOrders(store.getActiveOrders());
    };

    updateOrders();
    const interval = setInterval(updateOrders, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateItemStatus = (orderId: string, menuItemId: string, status: OrderItem['status']) => {
    store.updateOrderItemStatus(orderId, menuItemId, status);
    setOrders(store.getActiveOrders());
  };

  const getItemsByStatus = (order: Order) => {
    if (filter === 'all') return order.items;
    return order.items.filter(item => item.status === filter);
  };

  const getPendingCount = () => {
    return orders.reduce((count, order) => {
      return count + order.items.filter(item => item.status === 'pending').length;
    }, 0);
  };

  const getPreparingCount = () => {
    return orders.reduce((count, order) => {
      return count + order.items.filter(item => item.status === 'preparing').length;
    }, 0);
  };

  const getStatusColor = (status: OrderItem['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'preparing':
        return 'bg-blue-100 border-blue-500 text-blue-900';
      case 'ready':
        return 'bg-green-100 border-green-500 text-green-900';
      case 'served':
        return 'bg-gray-100 border-gray-500 text-gray-900';
    }
  };

  const getStatusIcon = (status: OrderItem['status']) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="text-red-600" size={20} />;
      case 'preparing':
        return <Clock className="text-blue-600" size={20} />;
      case 'ready':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'served':
        return <CheckCircle className="text-gray-600" size={20} />;
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ChefHat className="text-primary-500" size={36} />
          <h1 className="text-3xl font-bold text-white">Kitchen Display System</h1>
        </div>
        <p className="text-gray-400">Real-time order tracking for kitchen staff</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <p className="text-red-300 text-sm font-medium">Pending</p>
          <p className="text-3xl font-bold text-white mt-1">{getPendingCount()}</p>
        </div>
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
          <p className="text-blue-300 text-sm font-medium">Preparing</p>
          <p className="text-3xl font-bold text-white mt-1">{getPreparingCount()}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-300 text-sm font-medium">Active Orders</p>
          <p className="text-3xl font-bold text-white mt-1">{orders.length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('preparing')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'preparing' ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Preparing
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.length === 0 ? (
          <div className="col-span-full bg-gray-800 rounded-lg p-12 text-center">
            <ChefHat className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400 text-lg">No active orders</p>
          </div>
        ) : (
          orders.map(order => {
            const filteredItems = getItemsByStatus(order);
            if (filteredItems.length === 0) return null;

            return (
              <div key={order.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-700">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Table {order.tableNumber}</h3>
                    <p className="text-sm text-gray-400">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {format(new Date(order.createdAt), 'h:mm a')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)} min ago
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`border-2 rounded-lg p-4 ${getStatusColor(item.status)}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{item.quantity}x</span>
                            <span className="text-lg font-semibold">{item.menuItem.name}</span>
                          </div>
                          {item.notes && (
                            <p className="text-sm mt-1 italic">Note: {item.notes}</p>
                          )}
                        </div>
                        {getStatusIcon(item.status)}
                      </div>

                      <div className="flex items-center gap-2 text-sm mb-3">
                        <Clock size={14} />
                        <span>{item.menuItem.prepTime} min prep</span>
                      </div>

                      <div className="flex gap-2">
                        {item.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateItemStatus(order.id, item.menuItemId, 'preparing')}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded font-medium transition-colors text-sm"
                          >
                            Start Preparing
                          </button>
                        )}
                        {item.status === 'preparing' && (
                          <button
                            onClick={() => handleUpdateItemStatus(order.id, item.menuItemId, 'ready')}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded font-medium transition-colors text-sm"
                          >
                            Mark Ready
                          </button>
                        )}
                        {item.status === 'ready' && (
                          <button
                            onClick={() => handleUpdateItemStatus(order.id, item.menuItemId, 'served')}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded font-medium transition-colors text-sm"
                          >
                            Mark Served
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
