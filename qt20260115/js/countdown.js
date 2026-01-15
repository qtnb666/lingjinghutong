// 倒计时功能
let countdownInterval;

function initializeCountdown() {
    updateCountdown();
    
    // 每秒更新倒计时
    countdownInterval = setInterval(updateCountdown, 1000);
    
    console.log('倒计时初始化完成');
}

function updateCountdown() {
    // 设置截止日期：30天后的日期
    const now = new Date();
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + 30);
    targetDate.setHours(23, 59, 59, 0); // 设置为当天结束
    
    const timeRemaining = targetDate - now;
    
    // 如果时间已过，重置为新的目标日期
    if (timeRemaining <= 0) {
        targetDate.setDate(targetDate.getDate() + 30);
        const newTimeRemaining = targetDate - now;
        updateCountdownDisplay(newTimeRemaining);
        return;
    }
    
    updateCountdownDisplay(timeRemaining);
}

function updateCountdownDisplay(timeRemaining) {
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
    if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
    if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
}

// 清理倒计时定时器
function cleanupCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
}

// 页面卸载时清理资源
window.addEventListener('beforeunload', cleanupCountdown);