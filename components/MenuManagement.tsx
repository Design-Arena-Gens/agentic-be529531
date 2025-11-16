'use client';

import { useEffect, useState } from 'react';
import { store, MenuItem } from '@/lib/store';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    category: 'Coffee',
    price: 0,
    available: true,
    ingredients: [],
    prepTime: 5,
  });

  const categories = ['All', 'Coffee', 'Tea', 'Food', 'Pastry', 'Beverage'];

  useEffect(() => {
    setMenuItems(store.getMenuItems());
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddItem = () => {
    if (!formData.name || !formData.price) return;

    store.addMenuItem({
      name: formData.name,
      category: formData.category || 'Coffee',
      price: formData.price,
      available: formData.available ?? true,
      ingredients: formData.ingredients || [],
      prepTime: formData.prepTime || 5,
    });

    setMenuItems(store.getMenuItems());
    setIsAddingItem(false);
    setFormData({
      name: '',
      category: 'Coffee',
      price: 0,
      available: true,
      ingredients: [],
      prepTime: 5,
    });
  };

  const handleUpdateItem = () => {
    if (!editingItem || !formData.name || !formData.price) return;

    store.updateMenuItem(editingItem.id, {
      name: formData.name,
      category: formData.category,
      price: formData.price,
      available: formData.available,
      ingredients: formData.ingredients,
      prepTime: formData.prepTime,
    });

    setMenuItems(store.getMenuItems());
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Coffee',
      price: 0,
      available: true,
      ingredients: [],
      prepTime: 5,
    });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      store.deleteMenuItem(id);
      setMenuItems(store.getMenuItems());
    }
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      available: item.available,
      ingredients: item.ingredients,
      prepTime: item.prepTime,
    });
  };

  const handleToggleAvailability = (id: string, available: boolean) => {
    store.updateMenuItem(id, { available: !available });
    setMenuItems(store.getMenuItems());
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-500 mt-1">Add, edit, and manage menu items</p>
        </div>
        <button
          onClick={() => setIsAddingItem(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {(isAddingItem || editingItem) && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <button
              onClick={() => {
                setIsAddingItem(false);
                setEditingItem(null);
                setFormData({
                  name: '',
                  category: 'Coffee',
                  price: 0,
                  available: true,
                  ingredients: [],
                  prepTime: 5,
                });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (min)</label>
              <input
                type="number"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="5"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-600"
                />
                <span className="text-sm font-medium text-gray-700">Available</span>
              </label>
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
              onClick={editingItem ? handleUpdateItem : handleAddItem}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Save size={20} />
              {editingItem ? 'Update' : 'Add'} Item
            </button>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-lg shadow p-6 ${!item.available ? 'opacity-60' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(item)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-2xl font-bold text-primary-600">${item.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Prep time: {item.prepTime} min</p>
            </div>

            {item.ingredients.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-1">Ingredients:</p>
                <div className="flex flex-wrap gap-1">
                  {item.ingredients.map((ing, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => handleToggleAvailability(item.id, item.available)}
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                item.available
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {item.available ? 'Available' : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No items in this category
        </div>
      )}
    </div>
  );
}
