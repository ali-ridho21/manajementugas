import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import TaskItem from './components/TaskItem';

// URL Endpoint API FastAPI Anda
const API_URL = "http://127.0.0.1:8000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('Semua');

  // Hook untuk mengambil data dari MySQL saat aplikasi pertama kali dibuka
  useEffect(() => {
    fetchTasks();
  }, []);

  // 1. Fungsi GET: Mengambil data dari database via Backend
  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Gagal mengambil data dari server:", error);
    }
  };

  // 2. Fungsi POST: Mengirim data tugas baru ke database via Backend
  const handleAddTask = async (newTask) => {
    try {
      // PERBAIKAN: Memastikan objek yang dikirim secara eksplisit membawa status belum selesai (false)
      const taskDataWithStatus = {
        ...newTask,
        is_completed: false
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskDataWithStatus)
      });
      
      if (response.ok) {
        fetchTasks(); // Segera perbarui tampilan setelah data masuk database
      } else {
        console.error("Gagal menyimpan data ke database, status:", response.status);
      }
    } catch (error) {
      console.error("Terjadi error saat menambah tugas:", error);
    }
  };

  // 3. Fungsi PUT: Mengubah status tugas (Selesai/Belum) di database via Backend
  const handleToggleTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: "PUT"
      });
      if (response.ok) {
        fetchTasks(); // Refresh tampilan
      }
    } catch (error) {
      console.error("Gagal mengubah status tugas:", error);
    }
  };

  // 4. Fungsi DELETE: Menghapus tugas dari database via Backend
  const handleDeleteTask = async (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus tugas ini?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        fetchTasks(); // Refresh tampilan
      }
    } catch (error) {
      console.error("Gagal menghapus tugas:", error);
    }
  };

  // Logika Filter Tampilan yang Akurat
  // Logika Filter Tampilan menggunakan field 'status'
  const filteredTasks = tasks.filter(task => {
    if (filter === 'Belum Selesai') {
      return task.status === false || task.status === 0;
    }
    
    if (filter === 'Selesai') {
      return task.status === true || task.status === 1;
    }
    
    return true; // Menampilkan 'Semua'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex items-center gap-3">
          <span className="text-3xl">📋</span>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Tugasku: <span className="font-medium text-gray-500">Manajemen Tugas</span>
          </h2>
        </header>

        {/* Tata Letak Grid */}
        <main className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Kolom Kiri: Form Input */}
          <div className="md:col-span-2">
            <TaskForm onAddTask={handleAddTask} />
          </div>

          {/* Kolom Kanan: List Tampilan */}
          <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Daftar Tugas Anda</h3>
            
            <TaskFilter currentFilter={filter} onFilterChange={setFilter} />

            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">Tidak ada tugas dalam kategori ini.</p>
              ) : (
                filteredTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={handleToggleTask} 
                    onDelete={handleDeleteTask} 
                  />
                ))
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;