import React, { useState } from 'react';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
        Tambah Tugas Baru
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Tugas</label>
          <input 
            type="text" 
            placeholder="Contoh: Review Desain Mockup Frontend" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <span className="text-xs text-gray-400 mt-1 block">Wajib diisi</span>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
          <textarea 
            rows="4"
            placeholder="Detail mengenai tugas ini..." 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <span className="text-xs text-gray-400 mt-1 block">Opsional</span>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-1"
        >
          + Tambah Tugas
        </button>
      </form>
    </div>
  );
}

export default TaskForm;