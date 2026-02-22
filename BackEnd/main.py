from fastapi import FastAPI,Depends,HTTPException,status
import models
import Config, schemas, auth_token, hashing
from sqlalchemy.orm import Session
from datetime import timedelta
from Config import engine, session
from fastapi.security import OAuth2PasswordRequestForm





app=FastAPI()
models.Base.metadata.create_all(bind=engine)

def get_db():
    db =session()
    try:
        yield db
    finally: 
        db.close()



@app.get("/")
def greet():
    return(" Welcome to JanaSewa")




@app.post("/users",response_model=schemas.ShowUser,tags=['user'])
def create_user(user:schemas.User ,db:Session=Depends(get_db)):
    new_user= models.User(name=user.name, email=user.email, password=hashing.Hash.bcrypt(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.get("/all_users/")
def get_all_users(db: Session = Depends(get_db)):
    db_users= db.query(models.User).all()
    return db_users



@app.delete("/users/{id}", tags=['user'])    
def delete_users(id: int,db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return "deleted Successfully"
    else:
        raise HTTPException(status_code=404, detail="user not found")
    


@app.post("/login",response_model=schemas.Token,tags=['login'])
def login_user(request:schemas.Login ,db:Session=Depends(get_db)):
    user= db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404,detail="user not found")
    
    if not hashing.Hash.verify(user.password,request.password):
          raise HTTPException(status_code=401,detail="Invalid Password")
    

    access_token=auth_token.create_access_token(
        data={'sub':str(user.id)},expires_delta= timedelta(minutes=15)
        )
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

