from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database import engine, Base, TaskModel, get_db

# Otomatis membuat tabel 'tasks' di MySQL jika belum ada saat backend dinyalakan
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Mengizinkan Frontend React (Port 5173) mengakses API FastAPI ini (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas (Untuk validasi struktur data masuk dan keluar)
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    is_completed: bool

    class Config:
        from_attributes = True


# --- API ENDPOINTS ---

# 1. GET: Mengambil semua daftar tugas (diurutkan dari yang terbaru)
@app.get("/api/tasks", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(TaskModel).order_by(TaskModel.id.desc()).all()

# 2. POST: Menambahkan tugas baru ke database
# 2. POST: Menambahkan tugas baru ke database
# 2. POST: Menambahkan tugas baru ke database
@app.post("/api/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    if not task.title.strip():
        raise HTTPException(status_code=400, detail="Judul wajib diisi")
    
    # PERBAIKAN: Mengunci nilai awal ke angka 0
    db_task = TaskModel(
        title=task.title, 
        description=task.description, 
        is_completed=0  
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

# 3. PUT: Toggle status Selesai / Belum Selesai (Mengubah True <-> False)
# 3. PUT: Toggle status Selesai / Belum Selesai
@app.put("/api/tasks/{task_id}/toggle", response_model=TaskResponse)
def toggle_task_status(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Tugas tidak ditemukan")
    
    # PERBAIKAN: Jika 1 jadi 0, jika 0 jadi 1
    db_task.is_completed = 0 if db_task.is_completed == 1 else 1
    db.commit()
    db.refresh(db_task)
    return db_task

# 4. DELETE: Menghapus tugas dari database berdasarkan ID
@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Tugas tidak ditemukan")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Tugas berhasil dihapus"}