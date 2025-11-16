'use client';

import { useEffect, useState } from 'react';
import { store, Order } from '@/lib/store';
import { format } from 'date-fns';
import { DollarSign, Printer, CheckCircle, X } from 'lucide-react';

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  useEffect(() => {
    const updateOrders = () => {
      const allOrders = store.getOrders();
      setOrders(allOrders.reverse());
    };

    updateOrders();
    const interval = setInterval(updateOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const handleCompleteOrder = (orderId: string) => {
    store.completeOrder(orderId);
    setOrders(store.getOrders().reverse());
    setSelectedOrder(null);
  };

  const handlePrintBill = (order: Order) => {
    const printWindow = window.open('', '', 'width=300,height=600');
    if (!printWindow) return;

    const billHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill - ${order.id}</title>
        <style>
          body { font-family: 'Courier New', monospace; width: 280px; margin: 0; padding: 10px; }
          h1 { text-align: center; font-size: 18px; margin-bottom: 5px; }
          .info { text-align: center; font-size: 12px; margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .items { margin: 15px 0; }
          .item { display: flex; justify-content: space-between; margin: 8px 0; font-size: 12px; }
          .totals { border-top: 1px dashed #000; padding-top: 10px; margin-top: 10px; }
          .total-row { display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px; }
          .grand-total { font-weight: bold; font-size: 14px; border-top: 2px solid #000; padding-top: 5px; margin-top: 5px; }
          .footer { text-align: center; margin-top: 20px; font-size: 11px; border-top: 1px dashed #000; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>CAFE POS</h1>
        <div class="info">
          <div>Order: ${order.id}</div>
          <div>Table: ${order.tableNumber}</div>
          <div>Waiter: ${order.waiterName}</div>
          <div>Date: ${format(new Date(order.createdAt), 'MMM dd, yyyy hh:mm a')}</div>
        </div>

        <div class="items">
          ${order.items.map(item => `
            <div class="item">
              <div>${item.quantity}x ${item.menuItem.name}</div>
              <div>$${(item.quantity * item.menuItem.price).toFixed(2)}</div>
            </div>
            ${item.notes ? `<div style="font-size: 10px; margin-left: 20px; color: #666;">Note: ${item.notes}</div>` : ''}
          `).join('')}
        </div>

        <div class="totals">
          <div class="total-row">
            <div>Subtotal:</div>
            <div>$${order.total.toFixed(2)}</div>
          </div>
          <div class="total-row">
            <div>Tax (10%):</div>
            <div>$${(order.total * 0.1).toFixed(2)}</div>
          </div>
          <div class="total-row grand-total">
            <div>TOTAL:</div>
            <div>$${(order.total * 1.1).toFixed(2)}</div>
          </div>
        </div>

        <div class="footer">
          Thank you for dining with us!<br>
          Visit again soon!
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(billHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-500 mt-1">View and manage all orders</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'active' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'completed' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Completed
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No {filter !== 'all' && filter} orders found
            </div>
          ) : (
            filteredOrders.map(order => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                  selectedOrder?.id === order.id ? 'ring-2 ring-primary-600' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order {order.id}</h3>
                    <p className="text-sm text-gray-600">Table {order.tableNumber} • {order.waiterName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <span className="font-medium">${(item.quantity * item.menuItem.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-sm text-gray-600">Total: </span>
                    <span className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(order.createdAt), 'h:mm a')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Details */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium text-gray-900">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Table Number</p>
                  <p className="font-medium text-gray-900">{selectedOrder.tableNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Waiter</p>
                  <p className="font-medium text-gray-900">{selectedOrder.waiterName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy h:mm a')}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-200 pb-3">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{item.quantity}x {item.menuItem.name}</span>
                        <span className="font-medium">${(item.quantity * item.menuItem.price).toFixed(2)}</span>
                      </div>
                      {item.notes && (
                        <p className="text-sm text-gray-600">Note: {item.notes}</p>
                      )}
                      <div className="mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.status === 'pending' ? 'bg-gray-100 text-gray-700' :
                          item.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                          item.status === 'ready' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Tax (10%):</span>
                  <span>${(selectedOrder.total * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold mt-2 pt-2 border-t border-gray-200">
                  <span>Grand Total:</span>
                  <span>${(selectedOrder.total * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                {selectedOrder.status === 'active' && (
                  <button
                    onClick={() => handleCompleteOrder(selectedOrder.id)}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <CheckCircle size={20} />
                    Complete Order
                  </button>
                )}
                <button
                  onClick={() => handlePrintBill(selectedOrder)}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Printer size={20} />
                  Print Bill
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Select an order to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
