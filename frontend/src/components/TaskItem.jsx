import React from 'react';

function TaskItem({ task, onToggle, onDelete }) {
  // Membaca status boolean/integer baru dari backend
  const isDone = task.status === true || task.status === 1;

  return (
    <div className={`p-4 bg-white border rounded-xl flex justify-between items-center transition-all ${
      isDone 
        ? 'border-l-4 border-l-green-600 border-gray-200 bg-green-50/40' 
        : 'border-gray-200 hover:border-gray-300 shadow-sm'
    }`}>
      <div className="space-y-1 pr-4">
        <h4 className={`font-semibold text-gray-800 ${isDone ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h4>
        <p className={`text-sm ${isDone ? 'text-gray-400 line-through' : 'text-gray-500'}`}>
          {task.description || <span className="italic text-gray-300">Tidak ada deskripsi</span>}
        </p>
        {/* Opsional: Menampilkan info kapan tugas dibuat */}
        <span className="text-[10px] text-gray-300 block pt-1">
          Dibuat: {new Date(task.created_at).toLocaleString('id-ID')}
        </span>
      </div>
      
      <div className="flex gap-2 shrink-0">
        <button 
          onClick={() => onToggle(task.id)} 
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
            isDone 
              ? 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50' 
              : 'bg-green-600 border-transparent text-white hover:bg-green-700'
          }`}
        >
          {isDone ? '↩️ Belum Selesai' : '✅ Selesai'}
        </button>
        
        <button 
          onClick={() => onDelete(task.id)} 
          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold flex items-center gap-1 border border-transparent transition-colors"
        >
          🗑️ Hapus
        </button>
      </div>
    </div>
  );
}

export default TaskItem;