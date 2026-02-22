from sqlalchemy import Column,String,Integer,Boolean
from sqlalchemy.ext.declarative import declarative_base

Base=declarative_base()

class User(Base):

    __tablename__="users"

    id=  Column(Integer,primary_key=True,index=True)
    name=Column(String)
    email= Column(String)
    password=Column(String)
    is_admin = Column(Boolean, default=False ,nullable=False) 