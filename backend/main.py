from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from database import engine, Base, TaskModel, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

# PERBAIKAN: Menyesuaikan skema response dengan database baru
class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: bool # Menggunakan status (Boolean)
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# 1. GET: Mengambil semua tugas (diurutkan dari yang terbaru dibuat)
@app.get("/api/tasks", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(TaskModel).order_by(TaskModel.created_at.desc()).all()

# 2. POST: Menambahkan tugas baru (otomatis status = False)
@app.post("/api/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    if not task.title.strip():
        raise HTTPException(status_code=400, detail="Judul wajib diisi")
    
    db_task = TaskModel(
        title=task.title, 
        description=task.description, 
        status=False # Tegaskan default false saat dibuat
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

# 3. PUT: Toggle status (False <-> True)
@app.put("/api/tasks/{task_id}/toggle", response_model=TaskResponse)
def toggle_task_status(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Tugas tidak ditemukan")
    
    db_task.status = not db_task.status # Membalikkan nilai boolean status
    db.commit()
    db.refresh(db_task)
    return db_task

# 4. DELETE: Menghapus tugas
@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Tugas tidak ditemukan")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Tugas berhasil dihapus"}