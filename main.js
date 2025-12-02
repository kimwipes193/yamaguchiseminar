document.addEventListener("DOMContentLoaded", () => {
    // 1. ローディング
    const loadingScreen = document.getElementById("loading-screen");
    const loadingPercentage = document.getElementById("loading-percentage");
    if (loadingScreen && loadingPercentage) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 5) + 2;
            if (progress > 100) progress = 100;
            loadingPercentage.textContent = progress;
            if (progress >= 100) {
                clearInterval(interval);
                if (typeof gsap !== 'undefined') {
                    gsap.to(loadingScreen, { opacity: 0, duration: 0.8, onComplete: () => loadingScreen.style.display = "none" });
                    gsap.from(".catch-copy", { opacity: 0, y: 50, duration: 1, delay: 0.5 });
                } else {
                    loadingScreen.style.display = "none";
                }
            }
        }, 30);
    }

    // 2. AIパーティクル (Pop Version)
    const canvas = document.getElementById('popNetworkCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particles = [];
        const colors = ['#FF4291', '#F9C74F', '#577590'];
        let mouse = { x: null, y: null, radius: (canvas.height/80)*(canvas.width/80) };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x; mouse.y = e.y;
            const cursor = document.querySelector(".cursor");
            if(cursor) { cursor.style.top = e.y + "px"; cursor.style.left = e.x + "px"; }
        });
        window.addEventListener('touchmove', (e) => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; });

        class Particle {
            constructor(x, y, dx, dy, size, color) {
                this.x = x; this.y = y; this.dx = dx; this.dy = dy; this.size = size; this.color = color;
            }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color; ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
                if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;
                let dist = Math.sqrt((mouse.x - this.x)**2 + (mouse.y - this.y)**2);
                if (dist < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 1;
                    if (mouse.x > this.x && this.x > this.size * 10) this.x -= 1;
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 1;
                    if (mouse.y > this.y && this.y > this.size * 10) this.y -= 1;
                }
                this.x += this.dx; this.y += this.dy; this.draw();
            }
        }
        function init() {
            particles = [];
            let num = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < num; i++) {
                let size = (Math.random() * 5) + 2;
                let x = Math.random() * innerWidth; let y = Math.random() * innerHeight;
                let dx = (Math.random() - 0.5); let dy = (Math.random() - 0.5);
                let color = colors[Math.floor(Math.random() * colors.length)];
                particles.push(new Particle(x, y, dx, dy, size, color));
            }
        }
        function connect() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dist = ((particles[a].x - particles[b].x)**2) + ((particles[a].y - particles[b].y)**2);
                    if (dist < (canvas.width/7) * (canvas.height/7)) {
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; 
                        ctx.lineWidth = 1; ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
        function animate() { requestAnimationFrame(animate); ctx.clearRect(0,0,innerWidth, innerHeight); particles.forEach(p => p.update()); connect(); }
        window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; init(); });
        init(); animate();
    }
    
    // クリックエフェクト
    document.addEventListener("click", (e) => {
        const effect = document.querySelector(".click-effect");
        if(effect){
            effect.style.top = `${e.clientY}px`; effect.style.left = `${e.clientX}px`;
            effect.style.transform = "translate(-50%, -50%) scale(1.5)"; effect.style.opacity = "1";
            setTimeout(() => { effect.style.transform = "translate(-50%, -50%) scale(0)"; effect.style.opacity = "0"; }, 300);
        }
    });
});