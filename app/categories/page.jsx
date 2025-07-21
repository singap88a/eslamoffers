'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AllCategoriesPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://147.93.126.19:8080/api/Category/GetAllCategories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">جميع الفئات</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className="flex flex-col items-center p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-24 h-24 relative mb-4">
              <Image
                src={category.iconUrl}
                alt={category.name}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <span className="text-lg font-semibold text-gray-800">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllCategoriesPage; 