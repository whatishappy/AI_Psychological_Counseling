import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
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

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
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
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        hobbies: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        user_type: {
            type: DataTypes.ENUM('registered', 'guest'),
            allowNull: false,
            defaultValue: 'registered'
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other'),
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

// 咨询会话模型
interface ConsultationSessionAttributes {
    session_id: number;
    user_id?: number | null;
    session_title?: string | null;
    user_query: string;
    ai_response: string;
    consultation_type?: 'psychological' | 'sports_advice' | 'comprehensive';
    mood_rating?: number | null;
    session_duration?: number | null;
    assessment_result?: string | null;
    created_at?: Date;
}

interface ConsultationSessionCreationAttributes extends Optional<ConsultationSessionAttributes, 'session_id' | 'user_id' | 'session_title' | 'consultation_type' | 'mood_rating' | 'session_duration' | 'assessment_result' | 'created_at'> { }

class ConsultationSession extends Model<ConsultationSessionAttributes, ConsultationSessionCreationAttributes>
    implements ConsultationSessionAttributes {
    public session_id!: number;
    public user_id!: number | null;
    public session_title!: string | null;
    public user_query!: string;
    public ai_response!: string;
    public consultation_type!: 'psychological' | 'sports_advice' | 'comprehensive';
    public mood_rating!: number | null;
    public session_duration!: number | null;
    public assessment_result!: string | null;
    public created_at!: Date;
}

ConsultationSession.init(
    {
        session_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: 'user_id'
            }
        },
        session_title: { type: DataTypes.STRING(200), allowNull: true },
        user_query: { type: DataTypes.TEXT, allowNull: false },
        ai_response: { type: DataTypes.TEXT, allowNull: false },
        consultation_type: { 
            type: DataTypes.ENUM('psychological', 'sports_advice', 'comprehensive'), 
            defaultValue: 'psychological' 
        },
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

// 咨询消息模型
interface ConsultationMessageAttributes {
    message_id: number;
    session_id: number;
    message_type: 'user' | 'ai';
    content: string;
    mood_rating?: number | null;
    created_at?: Date;
}

interface ConsultationMessageCreationAttributes extends Optional<ConsultationMessageAttributes, 'message_id' | 'mood_rating' | 'created_at'> { }

class ConsultationMessage extends Model<ConsultationMessageAttributes, ConsultationMessageCreationAttributes>
    implements ConsultationMessageAttributes {
    public message_id!: number;
    public session_id!: number;
    public message_type!: 'user' | 'ai';
    public content!: string;
    public mood_rating!: number | null;
    public created_at!: Date;
}

ConsultationMessage.init(
    {
        message_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        session_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: {
                model: ConsultationSession,
                key: 'session_id'
            }
        },
        message_type: { type: DataTypes.ENUM('user', 'ai'), allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
        mood_rating: { type: DataTypes.INTEGER, allowNull: true },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
        sequelize,
        tableName: 'consultation_messages',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    }
);

class ExercisePlan extends Model { }
ExercisePlan.init(
    {
        plan_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: {
                model: User,
                key: 'user_id'
            }
        },
        plan_name: { type: DataTypes.STRING(100), allowNull: false },
        plan_description: { type: DataTypes.TEXT, allowNull: true },
        plan_type: { type: DataTypes.STRING(50), allowNull: true },
        duration_minutes: { type: DataTypes.INTEGER, allowNull: true },
        intensity_level: { type: DataTypes.STRING(20), allowNull: true },
        scheduled_date: { type: DataTypes.DATEONLY, allowNull: true },
        completed: { type: DataTypes.BOOLEAN, defaultValue: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
        sequelize,
        tableName: 'exercise_plans',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    }
);

class BodyMeasurement extends Model { }
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

class PsychologicalAssessment extends Model { }
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

class PhysicalAssessment extends Model { }
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

class Admin extends Model { }
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

class UserLoginLog extends Model { }
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

// 建立模型关联
User.hasMany(ConsultationSession, { foreignKey: 'user_id' });
ConsultationSession.belongsTo(User, { foreignKey: 'user_id' });
ConsultationSession.hasMany(ConsultationMessage, { foreignKey: 'session_id' });
ConsultationMessage.belongsTo(ConsultationSession, { foreignKey: 'session_id' });

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

// 导出所有模型
export { 
    User, 
    ConsultationSession, 
    ConsultationMessage,
    ExercisePlan, 
    BodyMeasurement, 
    PsychologicalAssessment, 
    PhysicalAssessment, 
    Admin, 
    UserLoginLog 
};

// 单独导出类型
export type { 
    ConsultationSessionAttributes,
    ConsultationMessageAttributes
};