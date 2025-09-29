from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from config import db

# Association tables for many-to-many
trainer_trainee = db.Table('trainer_trainee',
    db.Column('trainer_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('trainee_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)  
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    subscriptions = db.relationship('UserSubscription', backref='user', lazy=True)
    health_profile = db.relationship('HealthProfile', backref='user', uselist=False, lazy=True)
    attendances = db.relationship('Attendance', backref='user', lazy=True)
    rsvps = db.relationship('ClassRSVP', backref='user', lazy=True)
    trainees = db.relationship('User', secondary=trainer_trainee,
                               primaryjoin=(trainer_trainee.c.trainer_id == id),
                               secondaryjoin=(trainer_trainee.c.trainee_id == id),
                               backref=db.backref('trainers', lazy='dynamic'), lazy='dynamic')

    serialize_rules = ('-password_hash', '-trainees.trainers', '-trainers.trainees', '-trainees.health_profile', '-trainees.attendances', '-trainees.rsvps', '-trainees.subscriptions')  # Added to prevent recursion

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role
        }

class SubscriptionPlan(db.Model, SerializerMixin):
    __tablename__ = 'subscription_plans'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    duration_days = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    subscriptions = db.relationship('UserSubscription', backref='plan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'duration_days': self.duration_days,
            'price': self.price,
            'description': self.description
        }

class UserSubscription(db.Model, SerializerMixin):
    __tablename__ = 'user_subscriptions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('subscription_plans.id'), nullable=False)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime)
    serialize_rules = ('-user.subscriptions', '-plan.subscriptions')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'plan_id': self.plan_id,
            'name': self.plan.name,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat() if self.end_date else None
        }

class Attendance(db.Model, SerializerMixin):
    __tablename__ = 'attendances'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    attended = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.isoformat(),
            'attended': self.attended
        }

class HealthProfile(db.Model, SerializerMixin):
    __tablename__ = 'health_profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    weight_kg = db.Column(db.Float)
    height_cm = db.Column(db.Float)
    bmi = db.Column(db.Float)  # Added
    goal = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'weight_kg': self.weight_kg,
            'height_cm': self.height_cm,
            'bmi': self.bmi,
            'goal': self.goal
        }

class WorkoutClass(db.Model, SerializerMixin):
    __tablename__ = 'workout_classes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)
    description = db.Column(db.Text)
    trainer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    max_capacity = db.Column(db.Integer, default=10)  # Added
    current_capacity = db.Column(db.Integer, default=0)  # Added
    rsvps = db.relationship('ClassRSVP', backref='workout_class', lazy=True)
    trainer = db.relationship('User', backref='classes', lazy=True)
    users = association_proxy('rsvps', 'user')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'date_time': self.date_time.isoformat(),
            'description': self.description,
            'trainer_id': self.trainer_id,
            'max_capacity': self.max_capacity,
            'current_capacity': self.current_capacity
        }

class ClassRSVP(db.Model, SerializerMixin):
    __tablename__ = 'class_rsvps'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('workout_classes.id'), nullable=False)
    attending = db.Column(db.Boolean, default=False)
    serialize_rules = ('-user.rsvps', '-workout_class.rsvps')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'class_id': self.class_id,
            'attending': self.attending
        }