
import React, { useState, useMemo } from 'react';
import type { Item } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface DataTableProps {
  data: Item[];
  setData: React.Dispatch<React.SetStateAction<Item[]>>;
}

export const DataTable: React.FC<DataTableProps> = ({ data, setData }) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSelectOne = (id: number) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(data.map(item => item.id));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleDeleteSelected = () => {
    setData(prevData => prevData.filter(item => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
  };
  
  const handleDeleteOne = (id: number) => {
    setData(prevData => prevData.filter(item => item.id !== id));
    setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
    });
  };

  const handleCopySelected = () => {
    const itemsToCopy = data.filter(item => selectedIds.has(item.id));
    const newItems = itemsToCopy.map((item, index) => ({
      ...item,
      id: Date.now() + index, // Ensure unique ID
    }));
    setData(prevData => [...prevData, ...newItems]);
    setSelectedIds(new Set());
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });
  }, [data, sortOrder]);


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={handleSort}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-300 transition"
            disabled={data.length < 2}
          >
            Sort {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
          <button
            onClick={handleCopySelected}
            className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 disabled:bg-gray-300 transition"
            disabled={selectedIds.size === 0}
          >
            Copy
          </button>
        </div>
        <button
          onClick={handleDeleteSelected}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 disabled:bg-gray-300 transition"
          disabled={selectedIds.size === 0}
        >
          Delete
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="p-4">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedIds.size === data.length && data.length > 0}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              <th scope="col" className="px-6 py-3">No.</th>
              <th scope="col" className="px-6 py-3">Item</th>
              <th scope="col" className="px-6 py-3">Size</th>
              <th scope="col" className="px-6 py-3">Weight (g)</th>
              <th scope="col" className="px-6 py-3">Quantity</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="w-4 p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => handleSelectOne(item.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{index + 1}</td>
                  <td className="px-6 py-4">{item.item}</td>
                  <td className="px-6 py-4">{item.size}</td>
                  <td className="px-6 py-4">{item.weight}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteOne(item.id)} className="text-red-500 hover:text-red-700">
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No items added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
