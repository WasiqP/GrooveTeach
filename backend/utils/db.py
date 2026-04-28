from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from src.utils.settings import settings 

Base = declarative_base()

engine = create_engine(url=settings.DB_CONNECTION)

Session = sessionmaker(bind=engine)

LocalSession = sessionmaker(bind=engine)

def getDB():
    session = LocalSession()
    try:
        yield session
    finally:
        session.close()