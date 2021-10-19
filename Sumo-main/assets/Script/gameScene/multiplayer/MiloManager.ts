
export var MiloManager = function () {

    const users = [{
        "userId": "mx-user-1",
        "gameId": "86a01a92a84646e4ad33252f19b39385",
        "roomId": "7d1b376b-0eee-4d53-bd91-3cda5de62b43-1625715627668",
        "highestScore": 90,
        "lastLevel": 0,
        "gameMode": "score",
        "isFirstOpen": true,
        "roomType": "public/private",
        balance: 100,
        micEnabled: true,
    },
    {
        "userId": "mx-user-2",
        "gameId": "86a01a92a84646e4ad33252f19b39385",
        "roomId": "7d1b376b-0eee-4d53-bd91-3cda5de62b43-1625715627668",
        "highestScore": 90,
        "lastLevel": 0,
        "gameMode": "score",
        "isFirstOpen": true,
        "roomType": "public/private",
        balance: 100,
        micEnabled: true,
    }];

    const dataFromApp = {
        "players": [{
            "bot": false,
            "host": true,
            "name": "Player1",
            "profilePicUrl": "https://i.picsum.photos/id/177/200/200.jpg?hmac=785Vry8HsdS9dQ7mFYbwV8bR2tWVtzJWWl9YLp6L0n8",
            "userId": "mx-user-1"
        }, {
            "bot": false,
            "host": false,
            "name": "Player2",
            "profilePicUrl": "https://i.picsum.photos/id/445/200/300.jpg?hmac=7dfJBQTfK8boCS5_EXpFW8SC_8VKMgDw5yFInpEee4s",
            "userId": "mx-user-2"
        }]
    };


    var userNum = window.location.href.split('?')[1].split("user")[1];
    var userId = parseInt(userNum);
    var user = users[userId - 1];

    var initInfo = Object.assign({}, dataFromApp, {
        initInfo: user
    });

    function onGameInit() {
        return JSON.stringify(initInfo)
    }

    function onGameOver() {
    }

    function onGameStart() {
    }

    function onError() {
    }

    return {
        onGameInit,
        onGameOver,
        onGameStart,
        onError
    }
}