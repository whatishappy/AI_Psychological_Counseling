// 通过API创建测试用户
async function createTestUser() {
    const userData = {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com'
    };
    
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('Test user created successfully!');
            console.log('User:', result.user);
        } else {
            if (result.error === 'Username exists') {
                console.log('Test user already exists. You can use these credentials to login:');
                console.log('Username: testuser');
                console.log('Password: testpassword');
            } else {
                console.log('Error creating test user:', result.error);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('Make sure the server is running on port 3000');
    }
}

createTestUser();