class ZurckzCounterDown {
    constructor(config) {
        this.events$ = new rxjs.Subject();
        this.events = {
            finished: false,
        };
        this.countDownTime = config.time + 1;
        this.counter = this.countDownTime;
        this.display = config.display;
        this.speed = config.speed;
        this.active = false;
    }
    start() {
        this.interval = setInterval(() => {
            this.countDownTime--;            
            let hours = Math.floor(this.countDownTime / 3600);
            let minutes = Math.floor(this.countDownTime % 3600 / 60);
            let seconds = Math.floor(this.countDownTime % 3600 % 60);
            document.getElementById(
                this.display
            ).innerHTML = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            if (this.countDownTime < 0) {
                this.events.finished = true;
                this.events$.next(this.events);
                this.stop();
            }
        }, 1000);
    }

    setTime(time) {
        this.countDownTime = time;
        this.counter = this.countDownTime;
    }

    stop() {
        this.active = false;
        this.countDownTime = 0;
        clearInterval(this.interval);
        document.getElementById(this.display).innerHTML = `00:00:00`;
    }
    reset() {
        this.stop();
        this.countDownTime = this.counter;
    }

    get isActive() {
        return this.active;
    }

    get currentTime() {
        return this.countDownTime;
    }

    get status$() {
        return this.events$;
    }
}

//export default ZurckzCounterDown;