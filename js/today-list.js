// import ZurckzCounterDown from './ZurckzCounterDown.js';
// import ZurckzTodayList from './ZurckzTodayList.js';
let zStorage = new ZStorage('zurckz-today-list-v2', {
    status: 0,
    time: 0,
    tasks: [],
    songs: [],
    lastClosed: null,
    helper: 0,
});

if (zStorage.get('helper') == 0) {
    $('#help-viewer').removeClass('invisible');
    setTimeout(() => {
        $('#help-viewer').addClass('invisible');
        zStorage.update('helper', 1);
    }, 3500);
}

$('#modal').iziModal({
    borderBottom: false,
    headerColor: 'rgba(0,0,0,0)',
});
$('#settingsModal').iziModal({
    borderBottom: false,
    headerColor: 'rgba(0,0,0,0)',
});
$('#songsModal').iziModal({
    borderBottom: false,
    headerColor: 'rgba(0,0,0,0)',
});
$('#successModal').iziModal({
    transitionIn: 'comingIn',
    transitionOut: 'comingOut',
    transitionInOverlay: 'fadeIn',
    transitionOutOverlay: 'fadeOut',
    timeout: 2000,
    timeoutProgressbar: true,
    headerColor: 'rgb(0, 175, 102)',
    timeoutProgressbarColor: 'rgba(255,255,255,0.5)',
    borderBottom: false,
});

const addTaskButton = document.getElementById('fabAdTask');
addTaskButton.onclick = () => showFormTask();

let counter = new ZurckzCounterDown({
    time: zStorage.get('time'),
    display: 'counterDown',
    speed: 1,
});

let zurckzList = new ZurckzTodayList({
    list: 'task-list',
    songList: 'songList',
    tasks: zStorage.get('tasks'),
    songs: zStorage.get('songs'),
});

let zPlayer = new ZurckzPlayer([
    'I9mjKMB-Ipk',
    '0_19gk1Dc4w',
    'x88ic4vjrh4',
    'GpOcEcbycfo',
    'eZ3D8EaEtdI',
]);

counter.status$.subscribe({
    next: v => {
        if (v.finished) {
            destroyTaskList();
        }
    },
});

zPlayer.events$.subscribe({
    next: v => {
        console.log(v.ready);
        if (v.ready == true) {
            $('#player-surface').removeClass('invisible');
        }
        if (v.status == 1 || v.status == -5 || v.status == 2) {
            setLoader(false);
        } else {
            setLoader(true);
        }
        $('#track-name').text(v.currentTrackName);
    },
});

zurckzList.taskList.subscribe({
    next: v => {
        zStorage.update('tasks', v);
    },
});

zurckzList.songList$.subscribe({
    next: v => {
        zStorage.update('songs', v);
    },
});

window.addEventListener('beforeunload', function(e) {
    let time = new Date().getTime();
    zStorage.update('lastClosed', time);
    zStorage.update('time', counter.currentTime);
    // var confirmationMessage = '\o/';
    // (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    // return confirmationMessage; //Webkit, Safari, Chrome
});

function showSettings() {
    $('#settingsModal').iziModal('open');
}

function showSongs() {
    $('#songsModal').iziModal('open');
}

function showFormTask() {
    $('#modal').iziModal('open');
}

function showSuccess(title, subtitle) {
    $('#successModal').iziModal('open', {
        title: title,
        subtitle: subtitle,
    });
}

function cancelAddTask() {
    $('#modal').iziModal('close');
}

function closeModal(modal) {
    $('#' + modal).iziModal('close');
}

function saveTask(e) {
    e.preventDefault();
    zurckzList.addTask({
        description: $('#input-description').val(),
        priority: $('#input-priority').val(),
        status: 'created',
        id: new Date().getTime(),
    });
    $('#input-description').val('');
    showSuccess('Added task', 'Today list!');
    return false;
}

function saveSongs(e) {
    e.preventDefault();
    let time = $('#input-time').val();
    showSuccess('Ok', 'Today list!');
    return false;
}

function setTime(e) {
    e.preventDefault();
    let time = $('#input-time').val();
    counter.setTime(time * 60 * 60);
    zStorage.update('time', time * 60 * 60);
    showSuccess('Ok', 'Today list!');
    return false;
}

function start() {
    if (!counter.isActive) {
        counter.start();
        zStorage.update('status', 2);
    }
}

function validate(url) {
    // let re = /^(https\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    // return re.test(url);
    return true;
}

function addSong() {    
    let url = $('#input-new-link').val();
    if (validate(url)) {
        zurckzList.addSong({
            id: new Date().getTime() + 1,
            url: url,
        });
        $('#input-new-link').val('');
    } else {
        $('#addError').css('display', 'block');
        setInterval(() => {
            $('#addError').css('display', 'none');
        }, 2500);
    }
}

function deleteSong(id, song) {
    console.log('Remove song ' + id + ' ' + song);
    zurckzList.removeSong(song);
    $(`#${id}`).remove();
}

function onYouTubeIframeAPIReady() {
    zPlayer.onYouTubeIframeAPIReady();
}

function setLoader(value) {
    if (value) {
        $('#loader').removeClass('invisible');
        $('#loader').addClass('visible');
        $('#track-name').removeClass('visible');
        $('#track-name').addClass('invisible');
        return;
    }
    $('#track-name').removeClass('invisible');
    $('#track-name').addClass('visible');
    $('#loader').removeClass('visible');
    $('#loader').addClass('invisible');
}

function toggle() {
    setLoader(true);
    if (zPlayer.isPlaying) {
        zPlayer.pause();
        $('#c-play').addClass('show-c');
        $('#c-play').removeClass('hide-c');
        $('#c-pause').removeClass('show-c');
        $('#c-pause').addClass('hide-c');
    } else {
        $('#c-pause').removeClass('show-c');
        $('#c-play').addClass('hide-c');
        $('#c-pause').removeClass('hide-c');
        $('#c-pause').addClass('show-c');
        zPlayer.play();
    }
}

function next() {
    zPlayer.next();
}

function back() {
    zPlayer.back();
}

function closeTask(id) {
    zurckzList.closeTask(id);
}

function removeTask(id) {
    zurckzList.removeTask(id);
}

function destroyTaskList() {
    Swal.fire({
        title: 'Oops!',
        text: 'time is up, the task list will be removed!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!',
    }).then(result => {
        if (result.value) {
            zStorage.update('status', 0);
            counter.stop();
            counter.setTime(0);
            zurckzList.removeAllTasks();
            zPlayer.stop();
            Swal.fire(
                'Removed!',
                'You can add new tasks with a new time!',
                'success'
            );
        }
    });
}

switch (zStorage.get('status')) {
    case 2:
        let currentTime = new Date().getTime();
        let lastTime = zStorage.get('lastClosed');
        let diff = (currentTime - lastTime) / 1000;
        counter.setTime(zStorage.get('time') - diff);

        console.log(`
            ${currentTime}
            ${lastTime}
            ${diff}
            ${zStorage.get ('time')}
        `);

        if (counter.currentTime < 0) {
            destroyTaskList();
        } else {
            counter.start();
        }
        break;

    default:
        break;
}