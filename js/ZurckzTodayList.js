class ZurckzTodayList {
    constructor(config) {
        this.tasks$ = new rxjs.Subject();
        this.songs$ = new rxjs.Subject();
        this.tasks = config.tasks || [];
        this.songs = config.songs || [{
            id: 'zurckz-id-music',
            url: 'hHiQ77uQVOk',
        }, ];
        this.listId = config.list;
        this.songListId = config.songList;
        this.priorities = ['high', 'medium', 'low', 'close'];
        this._fillList();
        this._fillSongList();
    }

    _fillList() {
        let htmlList = document.getElementById(this.listId);
        htmlList.innerHTML = '';
        this.tasks.forEach(task => {
            let action = `<button title="Mark as finished" onclick="closeTask(${task.id})"><i class="fa fa-check" aria-hidden="true"></i></button>`;
            if (task.priority == 3) {
                action = `<button title="Remove from the list" onclick="removeTask(${task.id})"><i class="fa fa-times" aria-hidden="true"></i></button>`;
            }
            htmlList.insertAdjacentHTML(
                'beforeend',
                ` <li class="task">
            <div class="task-a task-action">
                ${action}
            </div>
            <div class="task-a task-description ct">
                <p>
                    ${task.description}
                </p>
            </div>
            <div class="task-a task-priority">
                <span class="${this.priorities[task.priority]}"></span>
            </div>
        </li>`
            );
        });
    }

    _fillSongList() {
        let htmlList = document.getElementById(this.songListId);
        htmlList.innerHTML = '';
        let i = 0;
        this.songs.forEach(song => {
            htmlList.insertAdjacentHTML(
                'beforeend',
                `<li class="link" id="song-${song.id}">
                <a href="${song.url}" target="_blank">
                ${song.url}
                </a>
                <button class="" type="button" onclick="deleteSong('song-${song.id}',${song.id})">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </button>
            </li>`
            );
        });
    }

    addTask(task) {
        console.log(`Task will to add`, task);
        this.tasks.push(task);
        this.tasks$.next(this.tasks);
        this.tasks = this.tasks.sort((ta, tb) => {
            return parseInt(ta.priority) - parseInt(tb.priority);
        });
        this._fillList();
    }

    closeTask(taskId) {
        this.tasks.map(task => {
            if (taskId === task.id) {
                task.priority = 3;
            }
            return task;
        });
        this.tasks$.next(this.tasks);
        this.tasks = this.tasks.sort((ta, tb) => {
            return parseInt(ta.priority) - parseInt(tb.priority);
        });
        this._fillList();
    }

    removeAllTasks() {
        this.tasks = [];
        this.tasks$.next(this.tasks);
        this._fillList();
    }

    addSong(song) {
        this.songs.push(song);
        this.songs$.next(this.songs);
        this._fillSongList();
    }

    removeSong(song) {
        console.log(song);
        this.songs = this.songs.filter(s => s.id != song);
        this.songs$.next(this.songs);
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(s => s.id != taskId);
        this.tasks$.next(this.tasks);
        this._fillList();
    }

    get taskList() {
        return this.tasks$;
    }

    get songList$() {
        return this.songs$;
    }
}

//export default ZurckzTodayList;