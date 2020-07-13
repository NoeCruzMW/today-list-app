class ZurckzPlayer {
    constructor(list) {
        this.events$ = new rxjs.Subject();
        this.events = {
            ready: false,
            currentTrackName: '',
            status: -5,
        };
        this.playList = list;
        this.current = 0;
        this.done = false;
        this.isPlaying = false;
        this.ready = false;
        this.__build();
        this.onReadyEvent = new CustomEvent('ready');
    }

    __updateStatus() {
        this.events$.next(this.events);
    }

    __build() {
        let tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    onYouTubeIframeAPIReady() {
        this.player = new YT.Player('player', {
            height: '0',
            width: '0',
            videoId: this.playList[this.current],
            events: {
                onReady: this.onPlayerReady.bind(this),
                onStateChange: this.onPlayerStateChange.bind(this),
                onError: this.onPlayerError.bind(this),
            },
        });
    }

    get status$() {
        return this.events$;
    }

    get isReady() {
        return this.isReady;
    }

    onPlayerError(e) {
        console.error(e);
        this.next();
    }

    onPlayerReady(event) {
        this.ready = true;
        this.events.ready = true;
        this.__updateStatus();
    }

    onPlayerStateChange(event) {
        console.log('event: ', event);
        this.events.status = event.data;
        this.__updateStatus();
        if (event.data == YT.PlayerState.PLAYING && !this.done) {
            this.done = true;
        }
        switch (event.data) {
            case YT.PlayerState.PLAYING:
                this.isPlaying = true;
                this.events.currentTrackName = this.player.getVideoUrl(); //this.playList[this.current];
                this.__updateStatus();
                break;
            case YT.PlayerState.ENDED:
                this.isPlaying = false;
                this.next();
                break;
            default:
                break;
        }
    }

    back() {
        this.stop();
        if (this.current > 1) {
            this.current--;
        } else {
            this.current = this.playList.length - 1;
        }
        this.load();
    }

    next() {
        this.stop();
        if (this.current < this.playList.length - 1) {
            this.current++;
        } else {
            this.current = 0;
        }
        this.load();
    }

    load() {
        this.player.loadVideoById(this.playList[this.current], 0, 'large');
        setTimeout(() => {
            this.player.playVideo();
            this.isPlaying = true;
        }, 50);
        this.done = false;
    }

    stop() {
        this.player.stopVideo();
        this.isPlaying = false;
    }

    pause() {
        this.player.pauseVideo();
        this.isPlaying = false;
    }

    play() {
        this.player.playVideo();
        this.isPlaying = true;
    }
}