<?php
require_once 'db_connection.php';

class UserManagement {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    // 用户注册
    public function register($userData) {
        // 验证必填字段
        $requiredFields = ['username', 'email', 'password', 'user_type'];
        foreach ($requiredFields as $field) {
            if (empty($userData[$field])) {
                return ['success' => false, 'message' => "字段 $field 不能为空"];
            }
        }
        
        // 检查用户名是否已存在
        if ($this->usernameExists($userData['username'])) {
            return ['success' => false, 'message' => '用户名已存在'];
        }
        
        // 检查邮箱是否已存在
        if ($this->emailExists($userData['email'])) {
            return ['success' => false, 'message' => '邮箱已被注册'];
        }
        
        // 密码加密
        $userData['password'] = password_hash($userData['password'], PASSWORD_DEFAULT);
        
        // 添加注册时间
        $userData['created_at'] = date('Y-m-d H:i:s');
        
        // 插入数据库
        try {
            $userId = $this->db->insert('users', $userData);
            
            // 根据用户类型创建相关记录
            $this->createUserProfile($userId, $userData['user_type']);
            
            return [
                'success' => true,
                'message' => '注册成功',
                'user_id' => $userId
            ];
        } catch (Exception $e) {
            return ['success' => false, 'message' => '注册失败: ' . $e->getMessage()];
        }
    }
    
    // 用户登录
    public function login($username, $password) {
        // 获取用户信息
        $user = $this->getUserByUsername($username);
        
        if (!$user) {
            return ['success' => false, 'message' => '用户不存在'];
        }
        
        // 验证密码
        if (!password_verify($password, $user['password'])) {
            return ['success' => false, 'message' => '密码错误'];
        }
        
        // 检查账户状态
        if ($user['status'] != 'active') {
            return ['success' => false, 'message' => '账户已被禁用'];
        }
        
        // 更新最后登录时间
        $this->updateLastLogin($user['id']);
        
        // 设置会话
        $this->setUserSession($user);
        
        return [
            'success' => true,
            'message' => '登录成功',
            'user' => $this->getSafeUserInfo($user)
        ];
    }
    
    // 检查用户名是否存在
    private function usernameExists($username) {
        $sql = "SELECT id FROM users WHERE username = :username";
        $result = $this->db->fetchOne($sql, ['username' => $username]);
        return !empty($result);
    }
    
    // 检查邮箱是否存在
    private function emailExists($email) {
        $sql = "SELECT id FROM users WHERE email = :email";
        $result = $this->db->fetchOne($sql, ['email' => $email]);
        return !empty($result);
    }
    
    // 根据用户名获取用户
    private function getUserByUsername($username) {
        $sql = "SELECT * FROM users WHERE username = :username OR email = :username";
        return $this->db->fetchOne($sql, ['username' => $username]);
    }
    
    // 更新最后登录时间
    private function updateLastLogin($userId) {
        $sql = "UPDATE users SET last_login = NOW() WHERE id = :id";
        $this->db->query($sql, ['id' => $userId]);
    }
    
    // 设置用户会话
    private function setUserSession($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['user_type'] = $user['user_type'];
        $_SESSION['logged_in'] = true;
        $_SESSION['login_time'] = time();
    }
    
    // 获取安全的用户信息（排除敏感信息）
    private function getSafeUserInfo($user) {
        unset($user['password']);
        unset($user['reset_token']);
        unset($user['reset_token_expiry']);
        return $user;
    }
    
    // 创建用户档案
    private function createUserProfile($userId, $userType) {
        $tableName = '';
        
        switch ($userType) {
            case 'student':
                $tableName = 'student_profiles';
                break;
            case 'teacher':
                $tableName = 'teacher_profiles';
                break;
            case 'parent':
                $tableName = 'parent_profiles';
                break;
            default:
                return;
        }
        
        $profileData = [
            'user_id' => $userId,
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        $this->db->insert($tableName, $profileData);
    }
    
    // 获取用户信息
    public function getUserInfo($userId) {
        $sql = "SELECT * FROM users WHERE id = :id";
        $user = $this->db->fetchOne($sql, ['id' => $userId]);
        
        if ($user) {
            return $this->getSafeUserInfo($user);
        }
        
        return null;
    }
    
    // 更新用户信息
    public function updateUserInfo($userId, $data) {
        // 不允许更新的字段
        $disallowedFields = ['id', 'username', 'password', 'created_at'];
        foreach ($disallowedFields as $field) {
            if (isset($data[$field])) {
                unset($data[$field]);
            }
        }
        
        if (empty($data)) {
            return ['success' => false, 'message' => '没有可更新的数据'];
        }
        
        try {
            $this->db->update('users', $data, 'id = :id', ['id' => $userId]);
            return ['success' => true, 'message' => '更新成功'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => '更新失败: ' . $e->getMessage()];
        }
    }
    
    // 修改密码
    public function changePassword($userId, $currentPassword, $newPassword) {
        // 获取当前用户信息
        $sql = "SELECT password FROM users WHERE id = :id";
        $user = $this->db->fetchOne($sql, ['id' => $userId]);
        
        if (!$user) {
            return ['success' => false, 'message' => '用户不存在'];
        }
        
        // 验证当前密码
        if (!password_verify($currentPassword, $user['password'])) {
            return ['success' => false, 'message' => '当前密码错误'];
        }
        
        // 更新密码
        $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
        $this->db->update('users', ['password' => $newPasswordHash], 'id = :id', ['id' => $userId]);
        
        return ['success' => true, 'message' => '密码修改成功'];
    }
}

// 使用示例
/*
session_start();
$userManager = new UserManagement();

// 注册示例
$registrationData = [
    'username' => 'testuser',
    'email' => 'test@example.com',
    'password' => 'password123',
    'user_type' => 'student',
    'full_name' => '测试用户'
];
$result = $userManager->register($registrationData);

// 登录示例
$loginResult = $userManager->login('testuser', 'password123');
*/
?>