"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://api.eslamoffers.com/api';

const SubscribeEmailPage = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/SubscribeEmail/GetAllEmails`);
      setEmails(response.data);
      setLoading(false);
    } catch (err) {
      setError('حدث خطأ أثناء جلب البيانات');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-teal-600">قائمة المشتركين في النشرة البريدية</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الاشتراك</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراء</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {emails.map((email) => (
              <tr key={email.id}>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">{email.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {new Date(email.confirmedAt).toLocaleDateString('ar-EG')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <a
                    href={`mailto:${email.email}?subject=رد على اشتراكك في النشرة البريدية&body=مرحبًا، شكرًا لاشتراكك في النشرة البريدية.`}
                    className="text-white bg-teal-600 hover:bg-teal-700 font-medium py-1 px-3 rounded"
                  >
                    رد
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscribeEmailPage;
