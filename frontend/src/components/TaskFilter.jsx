import React from 'react';

function TaskFilter({ currentFilter, onFilterChange }) {
  const filters = ['Semua', 'Belum Selesai', 'Selesai'];

  return (
    <div className="flex gap-2 mb-5 border-b border-gray-100 pb-3">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
            currentFilter === filter 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default TaskFilter;