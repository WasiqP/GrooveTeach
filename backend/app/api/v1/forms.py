from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.models.form import Form, FormResponse

router = APIRouter(prefix="/forms", tags=["forms"])


@router.get("")
def list_forms(db: DbSession, current_user: CurrentUser):
    rows = db.scalars(select(Form).where(Form.teacher_id == current_user.id)).all()
    return rows


@router.post("", status_code=status.HTTP_201_CREATED)
def create_form(payload: dict, db: DbSession, current_user: CurrentUser):
    form = Form(teacher_id=current_user.id, **payload)
    db.add(form)
    db.commit()
    db.refresh(form)
    return form


@router.get("/public/{form_id}")
def get_public_form(form_id: str, db: DbSession):
    form = db.get(Form, form_id)
    if form is None or not form.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")
    return {
        "id": form.id,
        "title": form.title,
        "description": form.description,
        "fields": form.fields,
    }


@router.post("/public/{form_id}/responses", status_code=status.HTTP_201_CREATED)
def submit_public_form(form_id: str, payload: dict, db: DbSession):
    form = db.get(Form, form_id)
    if form is None or not form.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")
    response = FormResponse(
        form_id=form_id,
        answers=payload.get("answers"),
        respondent_email=payload.get("respondentEmail"),
        submitted_at=datetime.now(timezone.utc),
    )
    form.response_count += 1
    db.add(response)
    db.add(form)
    db.commit()
    return {"id": response.id, "message": "Response submitted"}
