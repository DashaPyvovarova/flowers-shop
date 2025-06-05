'use client';

import { useState } from 'react';

import CategoriesTab from 'components/admin/CategoriesTab';
import FlowersTab from 'components/admin/FlowersTab/FlowersTab';
import OrdersTab from 'components/admin/OrdersTab';
import ReviewsTab from 'components/admin/ReviewsTab';
import UsersTab from 'components/admin/UsersTab';

type Tab = 'flowers' | 'categories' | 'users' | 'reviews' | 'orders';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('flowers');

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Панель адміністратора</h1>

      <nav className="flex justify-center space-x-4 mb-8">
        {
          (['flowers', 'categories', 'users', 'reviews', 'orders'] as Tab[]).map((tab) => (
            <button
              key={ tab }
              className={
                `px-4 py-2 rounded-t-lg font-semibold ${
                  activeTab === tab
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`
              }
              onClick={ () => setActiveTab(tab) }
            >
              { tab === 'flowers' && 'Квіти' }
              { tab === 'categories' && 'Категорії' }
              { tab === 'users' && 'Користувачі' }
              { tab === 'reviews' && 'Відгуки' }
              { tab === 'orders' && 'Замовлення' }
            </button>
          ))
        }
      </nav>

      <div>
        { activeTab === 'flowers' && <FlowersTab /> }
        { activeTab === 'categories' && <CategoriesTab /> }
        { activeTab === 'users' && <UsersTab /> }
        { activeTab === 'reviews' && <ReviewsTab /> }
        { activeTab === 'orders' && <OrdersTab /> }
      </div>
    </div>
  );
}
