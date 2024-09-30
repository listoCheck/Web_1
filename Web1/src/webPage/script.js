

function validateX() {
    x = document.getElementById("nums").value;

    if (x === null || x === "") {
        createNotification("Значение X не выбрано");
        return false;
    } else if (!isNumeric(x)) {
        createNotification("X должно быть числом");
        return false;
    }
    return true;
}

function validateY() {
    y = parseInt(document.querySelector("input[name=Y-input]").value.replace(",", "."));
    if (y === undefined || y === "") {
        createNotification("Y не введён");
        return false;
    } else if (!isNumeric(y)) {
        createNotification("Y не число");
        return false;
    } else if (!(y >= -3 && y <= 5)) {
        createNotification("Y не входит в область допустимых значений (-3 <= Y <= 5)");
        return false;
    }
    return true;
}

function validateR() {
    try {
        r = document.querySelector("input[type=radio]:checked").value;
        return true;
    } catch (err) {
        createNotification("Значение R не выбрано");
        return false;
    }
}

function createNotification(message) {
    let outputContainer = document.getElementById("outputContainer");
    if (outputContainer.contains(document.querySelector(".notification"))) {
        let stub = document.querySelector(".notification");
        stub.textContent = message;
        stub.classList.replace("outputStub", "errorStub");
    } else {
        let notificationTableRow = document.createElement("h4");
        notificationTableRow.innerHTML = "<span class='notification errorStub'></span>";
        outputContainer.prepend(notificationTableRow);
        let span = document.querySelector(".notification");
        span.textContent = message;
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);

}




function makeData(data) {
    let array = data.split(',');
    console.log(array[0], array[1], array[2], array[3], array[4]);
    let newRow = document.createElement("tr");
    let tdN = document.createElement("td");
    let tdX = document.createElement("td");
    let tdY = document.createElement("td");
    let tdR = document.createElement("td");
    let tdH = document.createElement("td");
    let tdT = document.createElement("td");
    let tdS = document.createElement("td");

    tdX.innerHTML = array[0];
    tdY.innerHTML = array[1];
    tdR.innerHTML = array[2];
    tdN.innerHTML = n;
    n++;


    let pointer = document.getElementById("pointer");
    let cx = 200 + 150 * Number.parseFloat(array[0]) / Number.parseFloat(array[2]);
    let cy = 200 - 150 * Number.parseFloat(array[1]) / Number.parseFloat(array[2]);

    let val4 = document.getElementById("hit");
    if (array[3] === "true") {
        pointer.setAttribute("fill", "green");
        createNotification("Попадание");
        tdH.innerHTML = "Да";
        let audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.play()

    } else {
        pointer.setAttribute("fill", "red");
        createNotification("Мимо!");
        tdH.innerHTML = "Нет";
        let audioPlayer2 = document.getElementById('audioPlayer2');
        audioPlayer2.play()
    }
    //val4.appendChild(tdH);

    let currentDate = new Date();
    tdT.innerHTML = currentDate;

    tdS.innerHTML = array[4];

    pointer.setAttribute('cx', cx);
    pointer.setAttribute('cy', cy);
    pointer.setAttribute('visibility', 'visible');

    newRow.appendChild(tdN);
    newRow.appendChild(tdX);
    newRow.appendChild(tdY);
    newRow.appendChild(tdR);
    newRow.appendChild(tdH);
    newRow.appendChild(tdT);
    newRow.appendChild(tdS);
    document.getElementById("outputContainer").appendChild(newRow);
}


document.getElementById("checkButton").onclick = function () {


    if (validateX() && validateY() && validateR()) {
        const coords = `x=${encodeURIComponent(x)}&y=${encodeURIComponent(y)}&r=${encodeURIComponent(r)}`;
        console.log(coords)
        //createNotification("Отправка запроса с координатами: " + coords);
        //sendGetRequest(coords);

        fetch('/fcgi-bin/Web1.jar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                x: x,
                y: y,
                r: r,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети или сервера');
                }
                return response.text();
            })
            .then(result => {
                console.log(result);
                createNotification("Ответ сервера: " + result);
                makeData(result)
            })
            .catch(error => {
                createNotification("Ошибка: " + error.message);
            });






    }
}

function sendGetRequest(coords) {
    console.log("coords: ", coords);
    const url = '/fcgi-bin/Web1.jar?' + coords;

    fetch(url, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети или сервера');
            }
            return response.text();
        })
        .then(result => {
            console.log(result);
            createNotification("Ответ сервера: " + result);
            makeData(result)
        })
        .catch(error => {
            createNotification("Ошибка: " + error.message);
        });
}


