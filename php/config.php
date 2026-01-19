<?php
// 数据库配置
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'youth_cybersecurity_platform');
define('DB_CHARSET', 'utf8mb4');

// 网站配置
define('SITE_NAME', '青少年网络安全赛事平台');
define('SITE_URL', 'http://localhost/youth-cybersecurity-platform');
define('ADMIN_EMAIL', 'admin@cybersecurity-youth.cn');

// 安全配置
define('SESSION_TIMEOUT', 3600); // 会话超时时间（秒）
define('MAX_LOGIN_ATTEMPTS', 5); // 最大登录尝试次数
define('LOGIN_LOCKOUT_TIME', 900); // 登录锁定时间（秒）

// 文件上传配置
define('MAX_FILE_SIZE', 5242880); // 5MB
define('ALLOWED_FILE_TYPES', ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'zip']);
define('UPLOAD_DIR', '../uploads/');

// 时区设置
date_default_timezone_set('Asia/Shanghai');

// 错误报告（开发环境）
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>