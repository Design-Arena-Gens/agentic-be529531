'use client';

import { useEffect, useState } from 'react';
import { store, Table } from '@/lib/store';
import { Users, Clock, CheckCircle } from 'lucide-react';

export default function TableManagement() {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    const updateTables = () => {
      setTables(store.getTables());
    };

    updateTables();
    const interval = setInterval(updateTables, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-500 text-green-900';
      case 'occupied':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
    }
  };

  const getStatusIcon = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'occupied':
        return <Clock className="text-red-600" size={20} />;
      case 'reserved':
        return <Clock className="text-yellow-600" size={20} />;
    }
  };

  const handleStatusChange = (tableId: string, status: Table['status']) => {
    store.updateTableStatus(tableId, status);
    setTables(store.getTables());
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Table Management</h1>
        <p className="text-gray-500 mt-1">Monitor and manage table availability</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium">Available</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {tables.filter(t => t.status === 'available').length}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700 font-medium">Occupied</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {tables.filter(t => t.status === 'occupied').length}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700 font-medium">Reserved</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {tables.filter(t => t.status === 'reserved').length}
          </p>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map(table => (
          <div
            key={table.id}
            className={`border-2 rounded-lg p-6 transition-all ${getStatusColor(table.status)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Table {table.number}</h3>
              {getStatusIcon(table.status)}
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm">
              <Users size={16} />
              <span>{table.capacity} seats</span>
            </div>

            <div className="mb-3">
              <p className="text-xs uppercase font-semibold mb-2">Status</p>
              <p className="text-sm font-medium capitalize">{table.status}</p>
            </div>

            {table.status !== 'occupied' && (
              <div className="space-y-2">
                {table.status === 'available' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(table.id, 'reserved')}
                      className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors text-sm"
                    >
                      Reserve
                    </button>
                  </>
                )}
                {table.status === 'reserved' && (
                  <button
                    onClick={() => handleStatusChange(table.id, 'available')}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors text-sm"
                  >
                    Make Available
                  </button>
                )}
              </div>
            )}

            {table.status === 'occupied' && table.currentOrderId && (
              <div className="mt-2">
                <p className="text-xs text-gray-600">Order: {table.currentOrderId}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
