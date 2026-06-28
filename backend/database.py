from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL koneksi ke MySQL (XAMPP default: user 'root' dan tanpa password)
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost:3306/task_db"

# 1. Membuat Engine Database (Ini yang memicu ImportError jika tidak ada)
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 2. Membuat SessionLocal untuk interaksi data
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Membuat Base class untuk mapping tabel
Base = declarative_base()

# Model Tabel MySQL untuk tugas
class TaskModel(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # PERBAIKAN: Gunakan Integer dengan default angka 0 (Artinya: Belum Selesai)
    is_completed = Column(Integer, default=0)

# Fungsi Dependency untuk mendapatkan session database pada setiap request API
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()