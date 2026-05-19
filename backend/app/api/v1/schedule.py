from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.models.schedule import ScheduleEvent

router = APIRouter(prefix="/schedule", tags=["schedule"])


@router.get("")
def list_events(db: DbSession, current_user: CurrentUser):
    rows = db.scalars(
        select(ScheduleEvent)
        .where(ScheduleEvent.teacher_id == current_user.id)
        .order_by(ScheduleEvent.start_time.asc())
    ).all()
    return rows


@router.post("", status_code=status.HTTP_201_CREATED)
def create_event(payload: dict, db: DbSession, current_user: CurrentUser):
    event = ScheduleEvent(teacher_id=current_user.id, **payload)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: str, db: DbSession, current_user: CurrentUser):
    event = db.get(ScheduleEvent, event_id)
    if event is None or event.teacher_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    db.delete(event)
    db.commit()
