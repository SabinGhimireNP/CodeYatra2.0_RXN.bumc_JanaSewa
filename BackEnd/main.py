from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
import models
import Config, schemas, auth_token, hashing
from sqlalchemy.orm import Session
from datetime import timedelta
from Config import engine, session
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def greet():
    return {"message": "Welcome to JanaSewa"}


@app.post("/users", response_model=schemas.ShowUser, tags=['user'])
def create_user(user: schemas.User, db: Session = Depends(get_db)):
    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashing.Hash.bcrypt(user.password),
        is_admin=user.is_admin
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.get("/all_users/")
def get_all_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@app.delete("/users/{id}", tags=['user'])
def delete_users(id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return {"message": "Deleted Successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")


@app.post("/login", response_model=schemas.Token, tags=['login'])
def login_user(request: schemas.Login, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not hashing.Hash.verify(user.password, request.password):
        raise HTTPException(status_code=401, detail="Invalid Password")

    access_token = auth_token.create_access_token(
        data={'sub': str(user.id)}, expires_delta=timedelta(minutes=15)
    )

    # Determine role and redirect based on is_admin
    if user.is_admin:
        role = "admin"
        redirect_to = "/admin-dashboard"
    else:
        role = "user"
        redirect_to = "/dashboard"

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": role,
        "redirect_to": redirect_to
    }



def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = auth_token.decode_access_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user



@app.get("/admin_dashboard", tags=['admin'])
def admin_dashboard(current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Access forbidden: Admins only")
    return RedirectResponse(url="http://localhost:5173/admin-dashboard", status_code=302)



@app.get("/user_dashboard", tags=['user'])
def user_dashboard(current_user: models.User = Depends(get_current_user)):
    return RedirectResponse(url="http://localhost:5173/", status_code=302)