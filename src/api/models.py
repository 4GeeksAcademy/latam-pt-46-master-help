from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, ForeignKey, Text, Enum, Integer, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column, relationship
from datetime import datetime
import enum

db = SQLAlchemy()


# Enum para tipos de paso
class StepType(enum.Enum):
    TEXT = "TEXT"
    IMAGE = "IMAGE"
    PDF = "PDF"
    VIDEO = "VIDEO"
    VIDEO_URL = "VIDEO_URL"

# Modelo de Usuario


class User(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    categories: Mapped[list["Category"]] = relationship(
        "Category", back_populates="user", cascade="all, delete-orphan")
    processes = relationship("Process", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # no incluir password por seguridad
        }

# Modelo de Proceso


class Process(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=True)
    category = relationship("Category", back_populates="processes")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    user = relationship("User", back_populates="processes")
    steps = relationship("Step", back_populates="process",
                         cascade="all, delete")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "created_at": self.created_at.isoformat(),
            "user_id": self.user_id
        }

# Modelo de Paso del Proceso


class Step(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    process_id: Mapped[int] = mapped_column(ForeignKey("process.id"))
    label: Mapped[str] = mapped_column(String(255))
    type: Mapped[StepType] = mapped_column(Enum(StepType), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=True)
    order: Mapped[int] = mapped_column(Integer)

    process = relationship("Process", back_populates="steps")

    def serialize(self):
        return {
            "id": self.id,
            "label": self.label,
            "type": self.type.name,
            "content": self.content,
            "order": self.order
        }


class Category(db.Model):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="categories")

    processes: Mapped[list["Process"]] = relationship("Process", back_populates="category", cascade="all, delete")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id
        }
