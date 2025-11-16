'use client';

import { useEffect, useState } from 'react';
import { store, Table, MenuItem, Order } from '@/lib/store';
import { Search, Plus, Minus, Trash2, Save, ShoppingCart } from 'lucide-react';

export default function WaiterMode() {
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [cart, setCart] = useState<{ menuItem: MenuItem; quantity: number; notes: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [waiterName, setWaiterName] = useState('');
  const [showWaiterInput, setShowWaiterInput] = useState(true);

  const categories = ['All', 'Coffee', 'Tea', 'Food', 'Pastry', 'Beverage'];

  useEffect(() => {
    const updateData = () => {
      setTables(store.getTables());
      setMenuItems(store.getMenuItems().filter(item => item.available));
    };

    updateData();
    const interval = setInterval(updateData, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTable = (table: Table) => {
    if (!waiterName) {
      alert('Please enter your name first');
      return;
    }

    setSelectedTable(table);

    if (table.currentOrderId) {
      const order = store.getOrder(table.currentOrderId);
      if (order) {
        setCurrentOrder(order);
        setCart(order.items.map(item => ({
          menuItem: item.menuItem,
          quantity: item.quantity,
          notes: item.notes || '',
        })));
      }
    } else {
      setCurrentOrder(null);
      setCart([]);
    }
  };

  const handleAddToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find(item => item.menuItem.id === menuItem.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.menuItem.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { menuItem, quantity: 1, notes: '' }]);
    }
  };

  const handleUpdateQuantity = (menuItemId: string, change: number) => {
    setCart(cart.map(item => {
      if (item.menuItem.id === menuItemId) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: Math.max(0, newQuantity) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleUpdateNotes = (menuItemId: string, notes: string) => {
    setCart(cart.map(item =>
      item.menuItem.id === menuItemId ? { ...item, notes } : item
    ));
  };

  const handleRemoveFromCart = (menuItemId: string) => {
    setCart(cart.filter(item => item.menuItem.id !== menuItemId));
  };

  const handleSaveOrder = () => {
    if (!selectedTable || cart.length === 0) return;

    let order: Order;

    if (currentOrder) {
      order = currentOrder;
      order.items = [];
    } else {
      order = store.createOrder(selectedTable.id, waiterName);
    }

    cart.forEach(item => {
      store.addItemToOrder(order.id, item.menuItem.id, item.quantity, item.notes);
    });

    alert('Order saved successfully!');
    setSelectedTable(null);
    setCurrentOrder(null);
    setCart([]);
    setTables(store.getTables());
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  };

  if (showWaiterInput && !waiterName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Waiter Mode</h1>
          <p className="text-gray-600 mb-6 text-center">Please enter your name to continue</p>
          <input
            type="text"
            value={waiterName}
            onChange={(e) => setWaiterName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && waiterName) {
                setShowWaiterInput(false);
              }
            }}
            placeholder="Your name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent mb-4"
            autoFocus
          />
          <button
            onClick={() => {
              if (waiterName) setShowWaiterInput(false);
            }}
            disabled={!waiterName}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Waiter Mode</h1>
            <p className="text-gray-500 mt-1">Welcome, {waiterName}</p>
          </div>
          <button
            onClick={() => {
              setWaiterName('');
              setShowWaiterInput(true);
            }}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Change Waiter
          </button>
        </div>
      </div>

      {!selectedTable ? (
        <>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Table</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables.map(table => (
              <button
                key={table.id}
                onClick={() => handleSelectTable(table)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  table.status === 'available'
                    ? 'bg-green-50 border-green-500 hover:bg-green-100'
                    : table.status === 'occupied'
                    ? 'bg-red-50 border-red-500 hover:bg-red-100'
                    : 'bg-yellow-50 border-yellow-500 hover:bg-yellow-100'
                }`}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">T{table.number}</p>
                  <p className="text-sm text-gray-600 mt-1 capitalize">{table.status}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Selection */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Table {selectedTable.number}
                </h2>
                <button
                  onClick={() => {
                    setSelectedTable(null);
                    setCurrentOrder(null);
                    setCart([]);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Change Table
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu items..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenuItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleAddToCart(item)}
                  className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-primary-600"
                >
                  <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xl font-bold text-primary-600">${item.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">{item.prepTime} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingCart className="text-primary-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Order Cart</h2>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No items in cart</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.menuItem.id} className="border-b border-gray-200 pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.menuItem.name}</h4>
                            <p className="text-sm text-gray-600">${item.menuItem.price.toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item.menuItem.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.menuItem.id, -1)}
                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.menuItem.id, 1)}
                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                          >
                            <Plus size={16} />
                          </button>
                          <span className="ml-auto font-semibold">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <input
                          type="text"
                          value={item.notes}
                          onChange={(e) => handleUpdateNotes(item.menuItem.id, e.target.value)}
                          placeholder="Add notes (e.g., no sugar)"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-600"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Items:</span>
                      <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total:</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveOrder}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Save size={20} />
                    {currentOrder ? 'Update Order' : 'Place Order'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
