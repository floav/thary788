
import React, { useState, useEffect } from 'react';
import { CATEGORIES } from './constants';
import type { Item, SubItem } from './types';
import { Clock } from './components/Clock';
import { DataTable } from './components/DataTable';

const App: React.FC = () => {
  const [categories] = useState(CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.name || '');
  const [subItems, setSubItems] = useState<SubItem[]>(categories[0]?.subItems || []);
  const [selectedSubItem, setSelectedSubItem] = useState<string>(categories[0]?.subItems[0]?.id || '');

  const [weight, setWeight] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [isQuantityEnabled, setIsQuantityEnabled] = useState(true);
  const [quantity, setQuantity] = useState('');
  const [quantityError, setQuantityError] = useState<string | null>(null);

  const [tableData, setTableData] = useState<Item[]>([]);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    const category = categories.find(c => c.name === selectedCategory);
    const newSubItems = category?.subItems || [];
    setSubItems(newSubItems);
    setSelectedSubItem(newSubItems[0]?.id || '');
  }, [selectedCategory, categories]);

  const handleSave = () => {
    if (isQuantityEnabled && !quantity.trim()) {
      setQuantityError('Please enter a quantity!');
      return;
    }
    setQuantityError(null);

    const subItemDetails = subItems.find(si => si.id === selectedSubItem);
    if (!subItemDetails) return;

    const newItem: Item = {
      id: nextId,
      item: subItemDetails.name,
      size: width && height ? `${width}cm x ${height}cm` : 'N/A',
      weight: weight ? `${weight}g` : 'N/A',
      quantity: isQuantityEnabled ? quantity : 'N/A',
    };

    setTableData(prevData => [...prevData, newItem]);
    setNextId(prevId => prevId + 1);

    // Reset form
    setWeight('');
    setWidth('');
    setHeight('');
    setQuantity('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Size Selection Tool
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold text-yellow-600 mb-2">
              Option 1: Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {categories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-lg font-semibold text-yellow-600 mb-2">
              Option 2: Select Sub-Item
            </label>
            <select
              value={selectedSubItem}
              onChange={(e) => setSelectedSubItem(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {subItems.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-yellow-600 mb-2">
            Customize Size
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Weight (g):</label>
              <input type="number" placeholder="Can be left empty" value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Width (cm):</label>
              <input type="number" placeholder="Can be left empty" value={width} onChange={e => setWidth(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Height (cm):</label>
              <input type="number" placeholder="Can be left empty" value={height} onChange={e => setHeight(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-3 mb-2">
            <input 
              type="checkbox" 
              id="quantity-toggle" 
              checked={isQuantityEnabled} 
              onChange={() => setIsQuantityEnabled(!isQuantityEnabled)}
              className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="quantity-toggle" className="font-medium text-gray-700">
              Quantity (ចំនួនគំរូ):
            </label>
          </div>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            disabled={!isQuantityEnabled}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
          />
          {quantityError && <p className="text-red-500 text-sm mt-1">{quantityError}</p>}
        </div>

        <div className="flex justify-start">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            Save
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <Clock />
          <DataTable data={tableData} setData={setTableData} />
        </div>
      </div>
    </div>
  );
};

export default App;
