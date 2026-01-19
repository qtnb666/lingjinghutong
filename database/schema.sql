-- 青少年网络安全赛事平台数据库结构

-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'teacher', 'parent', 'admin') NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    school VARCHAR(100),
    grade VARCHAR(20),
    avatar VARCHAR(255),
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    reset_token VARCHAR(100),
    reset_token_expiry DATETIME,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
);

-- 学生档案表
CREATE TABLE student_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    student_id VARCHAR(50),
    birth_date DATE,
    gender ENUM('male', 'female', 'other'),
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    emergency_contact VARCHAR(100),
    medical_info TEXT,
    awards TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id)
);

-- 教师档案表
CREATE TABLE teacher_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    teacher_id VARCHAR(50),
    department VARCHAR(100),
    position VARCHAR(100),
    teaching_years INT,
    certifications TEXT,
    awards TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_teacher_id (teacher_id)
);

-- 家长档案表
CREATE TABLE parent_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    children_ids TEXT, -- 存储关联的学生ID
    relationship VARCHAR(50),
    occupation VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 赛事表
CREATE TABLE competitions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    year INT NOT NULL,
    season VARCHAR(50), -- 春季赛、秋季赛等
    level ENUM('national', 'provincial', 'municipal', 'school') DEFAULT 'national',
    status ENUM('upcoming', 'ongoing', 'finished', 'cancelled') DEFAULT 'upcoming',
    description TEXT,
    rules TEXT,
    eligibility TEXT,
    registration_start DATETIME,
    registration_end DATETIME,
    competition_start DATETIME,
    competition_end DATETIME,
    max_participants INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_year (year),
    INDEX idx_status (status)
);

-- 报名表
CREATE TABLE registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    competition_id INT NOT NULL,
    user_id INT NOT NULL, -- 学生用户ID
    team_name VARCHAR(100),
    team_members TEXT, -- 存储JSON格式的队员信息
    teacher_id INT, -- 指导教师ID
    school VARCHAR(100),
    category VARCHAR(50),
    project_title VARCHAR(200),
    project_description TEXT,
    status ENUM('pending', 'approved', 'rejected', 'withdrawn') DEFAULT 'pending',
    submission_date DATETIME,
    approval_date DATETIME,
    approved_by INT, -- 审核人ID
    rejection_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (competition_id) REFERENCES competitions(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    UNIQUE KEY unique_registration (competition_id, user_id),
    INDEX idx_status (status),
    INDEX idx_competition (competition_id)
);

-- 作品提交表
CREATE TABLE submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registration_id INT UNIQUE NOT NULL,
    document_path VARCHAR(255),
    video_path VARCHAR(255),
    source_code_path VARCHAR(255),
    presentation_path VARCHAR(255),
    additional_files TEXT, -- 存储JSON格式的附加文件信息
    submission_date DATETIME,
    last_modified DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
);

-- 评审表
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    submission_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    score DECIMAL(5,2),
    creativity_score DECIMAL(5,2),
    technical_score DECIMAL(5,2),
    practicality_score DECIMAL(5,2),
    presentation_score DECIMAL(5,2),
    comments TEXT,
    suggestions TEXT,
    review_date DATETIME,
    status ENUM('draft', 'submitted', 'finalized') DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES submissions(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id),
    UNIQUE KEY unique_review (submission_id, reviewer_id)
);

-- 奖项表
CREATE TABLE awards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    competition_id INT NOT NULL,
    registration_id INT NOT NULL,
    award_level ENUM('gold', 'silver', 'bronze', 'honorable', 'participation'),
    award_name VARCHAR(100),
    certificate_number VARCHAR(50),
    certificate_path VARCHAR(255),
    awarded_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (competition_id) REFERENCES competitions(id),
    FOREIGN KEY (registration_id) REFERENCES registrations(id),
    INDEX idx_award_level (award_level)
);

-- 学习资源表
CREATE TABLE learning_resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    resource_type ENUM('video', 'document', 'presentation', 'link', 'quiz', 'exercise') NOT NULL,
    category VARCHAR(100),
    difficulty_level ENUM('beginner', 'intermediate', 'advanced'),
    file_path VARCHAR(255),
    external_url VARCHAR(500),
    duration INT, -- 视频时长（秒）或页面数
    author VARCHAR(100),
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_free BOOLEAN DEFAULT TRUE,
    tags TEXT, -- 存储JSON格式的标签
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_resource_type (resource_type),
    INDEX idx_category (category)
);

-- 公告表
CREATE TABLE announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('general', 'competition', 'learning', 'maintenance', 'urgent') DEFAULT 'general',
    priority INT DEFAULT 0, -- 优先级，数字越大优先级越高
    publish_date DATETIME,
    expiry_date DATETIME,
    is_published BOOLEAN DEFAULT FALSE,
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_type (type),
    INDEX idx_publish_date (publish_date)
);

-- 论坛帖子表
CREATE TABLE forum_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    category VARCHAR(100),
    tags TEXT, -- 存储JSON格式的标签
    view_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    last_reply_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_category (category),
    INDEX idx_author (author_id)
);

-- 论坛回复表
CREATE TABLE forum_replies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    author_id INT NOT NULL,
    content TEXT NOT NULL,
    parent_id INT, -- 用于嵌套回复
    like_count INT DEFAULT 0,
    is_answer BOOLEAN DEFAULT FALSE, -- 标记为最佳答案
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES forum_replies(id) ON DELETE CASCADE,
    INDEX idx_post (post_id)
);

-- 用户学习进度表
CREATE TABLE learning_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    resource_id INT NOT NULL,
    progress DECIMAL(5,2) DEFAULT 0, -- 完成百分比
    status ENUM('not_started', 'in_progress', 'completed', 'abandoned') DEFAULT 'not_started',
    last_accessed DATETIME,
    completed_date DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (resource_id) REFERENCES learning_resources(id),
    UNIQUE KEY unique_progress (user_id, resource_id)
);

-- 系统日志表
CREATE TABLE system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(100),
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- 初始化管理员账户（密码：admin123）
INSERT INTO users (username, email, password, user_type, full_name, status) 
VALUES ('admin', 'admin@cybersecurity-youth.cn', '$2y$10$YourHashedPasswordHere', 'admin', '系统管理员', 'active');