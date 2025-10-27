import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';

export interface UserAttributes {
    user_id: number;
    username: string;
    password_hash: string;
    email?: string | null;
    phone?: string | null;
    nickname?: string | null;
    avatar_url?: string | null;
    hobbies?: string | null; // JSON
    user_type?: 'guest' | 'registered';
    age?: number | null;
    gender?: 'male' | 'female' | 'other' | null;
    created_at?: Date;
    updated_at?: Date;
    last_login?: Date | null;
    is_active?: boolean;
}

type UserCreationAttributes = Optional<UserAttributes, 'user_id' | 'user_type' | 'is_active'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare user_id: number;
    declare username: string;
    declare password_hash: string;
    declare email: string | null;
    declare phone: string | null;
    declare nickname: string | null;
    declare avatar_url: string | null;
    declare hobbies: string | null;
    declare user_type: 'guest' | 'registered';
    declare age: number | null;
    declare gender: 'male' | 'female' | 'other' | null;
    declare created_at: Date;
    declare updated_at: Date;
    declare last_login: Date | null;
    declare is_active: boolean;
}

User.init(
    {
        user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
        password_hash: { type: DataTypes.STRING(255), allowNull: false },
        email: { type: DataTypes.STRING(100), allowNull: true, unique: true },
        phone: { type: DataTypes.STRING(20), allowNull: true },
        nickname: { type: DataTypes.STRING(50), allowNull: true },
        avatar_url: { type: DataTypes.STRING(500), allowNull: true },
        hobbies: { type: DataTypes.TEXT, allowNull: true },
        user_type: { type: DataTypes.ENUM('guest', 'registered'), allowNull: false, defaultValue: 'guest' },
        age: { type: DataTypes.INTEGER, allowNull: true },
        gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: true },
        updated_at: { type: DataTypes.DATE, allowNull: true },
        last_login: { type: DataTypes.DATE, allowNull: true },
        is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    { sequelize, tableName: 'users' }
);

export class ConsultationSession extends Model { }
ConsultationSession.init(
    {
        session_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            defaultValue: null,
            references: {
                model: User,
                key: 'user_id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        },
        session_title: { type: DataTypes.STRING(200), allowNull: true },
        user_query: { type: DataTypes.TEXT, allowNull: false },
        ai_response: { type: DataTypes.TEXT, allowNull: false },
        consultation_type: { type: DataTypes.ENUM('psychological', 'sports_advice', 'comprehensive'), defaultValue: 'psychological' },
        mood_rating: { type: DataTypes.INTEGER, allowNull: true },
        session_duration: { type: DataTypes.INTEGER, allowNull: true },
        assessment_result: { type: DataTypes.TEXT, allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW }
    },
    { 
        sequelize, 
        tableName: 'consultation_sessions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    }
);

export class ExercisePlan extends Model { }
ExercisePlan.init(
    {
        plan_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        session_id: { type: DataTypes.INTEGER, allowNull: true },
        plan_name: { type: DataTypes.STRING(200), allowNull: false },
        plan_description: { type: DataTypes.TEXT, allowNull: true },
        plan_content: { type: DataTypes.JSON, allowNull: false },
        duration_weeks: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
        intensity_level: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' },
        target_areas: { type: DataTypes.JSON, allowNull: true },
        calories_target: { type: DataTypes.INTEGER, allowNull: true },
        status: { type: DataTypes.ENUM('active', 'completed', 'paused'), defaultValue: 'active' },
        created_at: { type: DataTypes.DATE, allowNull: true },
        start_date: { type: DataTypes.DATEONLY, allowNull: true },
        end_date: { type: DataTypes.DATEONLY, allowNull: true }
    },
    { sequelize, tableName: 'exercise_plans' }
);

export class BodyMeasurement extends Model { }
BodyMeasurement.init(
    {
        measurement_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        weight: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
        height: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
        waist_circumference: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
        chest_circumference: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
        hip_circumference: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
        bmi: { type: DataTypes.DECIMAL(4, 2), allowNull: true },
        body_fat_percentage: { type: DataTypes.DECIMAL(4, 2), allowNull: true },
        muscle_mass: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
        measurement_date: { type: DataTypes.DATEONLY, allowNull: false },
        notes: { type: DataTypes.TEXT, allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: true }
    },
    { sequelize, tableName: 'body_measurements' }
);

export class PsychologicalAssessment extends Model { }
PsychologicalAssessment.init(
    {
        assessment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        assessment_date: { type: DataTypes.DATEONLY, allowNull: false },
        overall_score: { type: DataTypes.INTEGER, allowNull: true },
        stress_level: { type: DataTypes.INTEGER, allowNull: true },
        anxiety_level: { type: DataTypes.INTEGER, allowNull: true },
        depression_level: { type: DataTypes.INTEGER, allowNull: true },
        sleep_quality: { type: DataTypes.INTEGER, allowNull: true },
        social_support: { type: DataTypes.INTEGER, allowNull: true },
        assessment_details: { type: DataTypes.JSON, allowNull: true },
        recommendations: { type: DataTypes.TEXT, allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: true }
    },
    { sequelize, tableName: 'psychological_assessments' }
);

export class PhysicalAssessment extends Model { }
PhysicalAssessment.init(
    {
        assessment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        assessment_date: { type: DataTypes.DATEONLY, allowNull: false },
        overall_score: { type: DataTypes.INTEGER, allowNull: true },
        cardiovascular_level: { type: DataTypes.INTEGER, allowNull: true },
        strength_level: { type: DataTypes.INTEGER, allowNull: true },
        flexibility_level: { type: DataTypes.INTEGER, allowNull: true },
        endurance_level: { type: DataTypes.INTEGER, allowNull: true },
        assessment_details: { type: DataTypes.JSON, allowNull: true },
        recommendations: { type: DataTypes.TEXT, allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: true }
    },
    { sequelize, tableName: 'physical_assessments' }
);

export class Admin extends Model { }
Admin.init(
    {
        admin_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
        password_hash: { type: DataTypes.STRING(255), allowNull: false },
        email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        full_name: { type: DataTypes.STRING(100), allowNull: true },
        role: { type: DataTypes.ENUM('super_admin', 'content_admin', 'user_admin'), defaultValue: 'user_admin' },
        is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
        created_at: { type: DataTypes.DATE, allowNull: true },
        last_login: { type: DataTypes.DATE, allowNull: true }
    },
    { sequelize, tableName: 'admins' }
);

export class UserLoginLog extends Model { }
UserLoginLog.init(
    {
        log_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: true },
        login_type: { type: DataTypes.ENUM('guest', 'registered'), allowNull: false },
        ip_address: { type: DataTypes.STRING(45), allowNull: true },
        user_agent: { type: DataTypes.TEXT, allowNull: true },
        login_time: { type: DataTypes.DATE, allowNull: true },
        session_duration: { type: DataTypes.INTEGER, allowNull: true }
    },
    { sequelize, tableName: 'user_login_logs' }
);

// Associations
User.hasMany(ConsultationSession, { foreignKey: 'user_id', onDelete: 'SET NULL' });
ConsultationSession.belongsTo(User, { 
    foreignKey: 'user_id',
    allowNull: true,
    onDelete: 'SET NULL'
});

User.hasMany(ExercisePlan, { foreignKey: 'user_id' });
ExercisePlan.belongsTo(User, { foreignKey: 'user_id' });

ExercisePlan.belongsTo(ConsultationSession, { foreignKey: 'session_id' });

User.hasMany(BodyMeasurement, { foreignKey: 'user_id' });
BodyMeasurement.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(PsychologicalAssessment, { foreignKey: 'user_id' });
PsychologicalAssessment.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(PhysicalAssessment, { foreignKey: 'user_id' });
PhysicalAssessment.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(UserLoginLog, { foreignKey: 'user_id' });
UserLoginLog.belongsTo(User, { foreignKey: 'user_id' });

export default {
    User,
    ConsultationSession,
    ExercisePlan,
    BodyMeasurement,
    PsychologicalAssessment,
    PhysicalAssessment,
    Admin,
    UserLoginLog
};


