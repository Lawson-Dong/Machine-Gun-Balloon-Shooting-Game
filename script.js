// 游戏变量
let score = 0;
let timeLeft = 30;
let gameInterval;
let balloonInterval;
let isGameActive = false;
let isShooting = false;
let shootInterval;
let bullets = [];
let balloons = [];

// DOM元素
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const gameArea = document.getElementById('game-area');
let machineGun = document.getElementById('machine-gun');
const startBtn = document.getElementById('start-btn');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// 气球颜色
const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];

// 开始游戏
function startGame() {
    score = 0;
    timeLeft = 30;
    isGameActive = true;
    isShooting = false;
    bullets = [];
    balloons = [];
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    gameOverElement.classList.add('hidden');
    startBtn.disabled = true;
    
    // 清空游戏区域，保留机枪
    gameArea.innerHTML = '<div id="machine-gun"></div>';
    
    // 重新获取机枪元素
    machineGun = document.getElementById('machine-gun');
    
    // 开始生成气球
    balloonInterval = setInterval(createBalloon, 800);
    
    // 开始倒计时
    gameInterval = setInterval(updateGame, 1000);
    
    // 开始游戏循环
    gameLoop();
}

// 更新游戏状态
function updateGame() {
    timeLeft--;
    timerElement.textContent = timeLeft;
    
    if (timeLeft <= 0) {
        endGame();
    }
}

// 游戏主循环
function gameLoop() {
    if (!isGameActive) return;
    
    // 更新子弹位置
    updateBullets();
    
    // 检测碰撞
    checkCollisions();
    
    // 继续游戏循环
    requestAnimationFrame(gameLoop);
}

// 创建气球
function createBalloon() {
    if (!isGameActive) return;
    
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    
    // 随机颜色
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    balloon.style.backgroundColor = color;
    
    // 随机位置
    const x = Math.random() * (gameArea.offsetWidth - 60);
    balloon.style.left = x + 'px';
    balloon.style.bottom = '-80px';
    
    gameArea.appendChild(balloon);
    
    // 添加到气球数组
    balloons.push({
        element: balloon,
        x: x,
        y: -80,
        speed: Math.random() * 1 + 1 // 随机速度
    });
}

// 创建子弹
function createBullet() {
    if (!isGameActive || !isShooting) return;
    
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    
    // 获取机枪位置
    const gunRect = machineGun.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();
    
    const bulletX = gunRect.left + gunRect.width / 2 - gameAreaRect.left - 2;
    const bulletY = gunRect.top - gameAreaRect.top + gunRect.height;
    
    bullet.style.left = bulletX + 'px';
    bullet.style.top = bulletY + 'px';
    
    gameArea.appendChild(bullet);
    
    // 添加到子弹数组
    bullets.push({
        element: bullet,
        x: bulletX,
        y: bulletY,
        speed: 8
    });
}

// 更新子弹位置
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y += bullet.speed; // 子弹向下移动
        bullet.element.style.top = bullet.y + 'px';
        
        // 子弹飞出屏幕
        if (bullet.y > gameArea.offsetHeight) {
            if (bullet.element.parentNode) {
                bullet.element.parentNode.removeChild(bullet.element);
            }
            bullets.splice(i, 1);
        }
    }
    
    // 更新气球位置
    for (let i = balloons.length - 1; i >= 0; i--) {
        const balloon = balloons[i];
        balloon.y += balloon.speed; // 气球向上移动
        balloon.element.style.bottom = balloon.y + 'px';
        
        // 气球飞出屏幕
        if (balloon.y > gameArea.offsetHeight) {
            if (balloon.element.parentNode) {
                balloon.element.parentNode.removeChild(balloon.element);
            }
            balloons.splice(i, 1);
        }
    }
}

// 检测碰撞
function checkCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        for (let j = balloons.length - 1; j >= 0; j--) {
            const balloon = balloons[j];
            
            // 计算气球的实际top位置（因为气球使用bottom定位）
            const balloonTop = gameArea.offsetHeight - balloon.y - 80;
            
            // 简单碰撞检测
            if (bullet.x >= balloon.x && bullet.x <= balloon.x + 60 &&
                bullet.y >= balloonTop && bullet.y <= balloonTop + 80) {
                
                // 增加分数
                score++;
                scoreElement.textContent = score;
                
                // 气球爆炸效果
                balloon.element.style.transform = 'scale(1.5)';
                balloon.element.style.opacity = '0';
                
                setTimeout(() => {
                    if (balloon.element.parentNode) {
                        balloon.element.parentNode.removeChild(balloon.element);
                    }
                }, 200);
                
                // 移除子弹和气球
                if (bullet.element.parentNode) {
                    bullet.element.parentNode.removeChild(bullet.element);
                }
                bullets.splice(i, 1);
                balloons.splice(j, 1);
                
                break;
            }
        }
    }
}

// 结束游戏
function endGame() {
    isGameActive = false;
    isShooting = false;
    clearInterval(gameInterval);
    clearInterval(balloonInterval);
    if (shootInterval) {
        clearInterval(shootInterval);
    }
    
    // 显示游戏结束界面
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
    startBtn.disabled = false;
    
    // 移除所有子弹和气球
    bullets.forEach(bullet => {
        if (bullet.element.parentNode) {
            bullet.element.parentNode.removeChild(bullet.element);
        }
    });
    
    balloons.forEach(balloon => {
        if (balloon.element.parentNode) {
            balloon.element.parentNode.removeChild(balloon.element);
        }
    });
    
    bullets = [];
    balloons = [];
}

// 鼠标移动事件 - 控制机枪瞄准
gameArea.addEventListener('mousemove', (e) => {
    if (!isGameActive) return;
    
    const gameAreaRect = gameArea.getBoundingClientRect();
    const mouseX = e.clientX - gameAreaRect.left;
    
    // 限制机枪移动范围
    const gunX = Math.max(40, Math.min(gameArea.offsetWidth - 40, mouseX));
    machineGun.style.left = gunX + 'px';
    machineGun.style.transform = 'translateX(-50%)';
});

// 鼠标按下事件 - 开始射击
gameArea.addEventListener('mousedown', (e) => {
    if (!isGameActive) return;
    
    isShooting = true;
    shootInterval = setInterval(createBullet, 100); // 每秒发射10发子弹
});

// 鼠标释放事件 - 停止射击
gameArea.addEventListener('mouseup', () => {
    isShooting = false;
    if (shootInterval) {
        clearInterval(shootInterval);
    }
});

// 鼠标离开事件 - 停止射击
gameArea.addEventListener('mouseleave', () => {
    isShooting = false;
    if (shootInterval) {
        clearInterval(shootInterval);
    }
});

// 事件监听器
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
