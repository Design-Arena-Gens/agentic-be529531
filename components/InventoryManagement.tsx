'use client';

import { useEffect, useState } from 'react';
import { store, InventoryItem } from '@/lib/store';
import { Plus, Edit2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    quantity: 0,
    unit: 'kg',
    minQuantity: 0,
    cost: 0,
  });

  useEffect(() => {
    const updateInventory = () => {
      setInventory(store.getInventory());
    };

    updateInventory();
    const interval = setInterval(updateInventory, 2000);
    return () => clearInterval(interval);
  }, []);

  const lowStockItems = store.getLowStockItems();

  const handleAddItem = () => {
    if (!formData.name || formData.quantity === undefined) return;

    store.addInventoryItem({
      name: formData.name,
      quantity: formData.quantity,
      unit: formData.unit || 'kg',
      minQuantity: formData.minQuantity || 0,
      cost: formData.cost || 0,
    });

    setInventory(store.getInventory());
    setIsAddingItem(false);
    setFormData({
      name: '',
      quantity: 0,
      unit: 'kg',
      minQuantity: 0,
      cost: 0,
    });
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    store.updateInventoryQuantity(id, newQuantity);
    setInventory(store.getInventory());
  };

  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      minQuantity: item.minQuantity,
      cost: item.cost,
    });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Track and manage stock levels</p>
        </div>
        <button
          onClick={() => setIsAddingItem(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="text-red-500 mr-3" size={24} />
            <div>
              <h3 className="text-red-800 font-semibold">Low Stock Alert</h3>
              <p className="text-red-700 text-sm">
                {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} need restocking
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAddingItem || editingItem) && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="Item name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="pieces">pieces</option>
                <option value="loaves">loaves</option>
                <option value="units">units</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Quantity</label>
              <input
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Unit ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                setIsAddingItem(false);
                setEditingItem(null);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddItem}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {editingItem ? 'Update' : 'Add'} Item
            </button>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost/Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map(item => (
                <tr key={item.id} className={`hover:bg-gray-50 ${item.quantity <= item.minQuantity ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {item.quantity <= item.minQuantity && (
                        <AlertTriangle className="text-red-500 mr-2" size={18} />
                      )}
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.minQuantity} {item.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${item.cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${(item.quantity * item.cost).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {item.quantity <= item.minQuantity ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 10)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Increase stock"
                      >
                        <TrendingUp size={18} />
                      </button>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 10))}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Decrease stock"
                      >
                        <TrendingDown size={18} />
                      </button>
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit item"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Items</h3>
          <p className="text-3xl font-bold text-gray-900">{inventory.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Inventory Value</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-red-600">{lowStockItems.length}</p>
        </div>
      </div>
    </div>
  );
}
