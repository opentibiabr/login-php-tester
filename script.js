(function () {
    var randomField = document.getElementById('randomField')
    var accountNameField = document.getElementById('accountNameField')
    var passwordField = document.getElementById('passwordField')
    var endpointField = document.getElementById('endpointField')
    var disabledLabel = document.querySelectorAll('.disabledLabel')
    var loginForm = document.getElementById('loginForm')
    var statusContainer = document.querySelector('.status')
    var responseContainer = document.querySelector('.response')
    var requestedAtContainer = document.querySelector('.requestedAt')
    
    function pad(value) {
        if (value < 10) {
            return '0' + value
        }

        return value
    }

    function getFormattedNow() {
        var now = new Date()
        return [now.getHours(), now.getMinutes(), now.getSeconds()].map(pad).join(':') + ' ' + [now.getFullYear(), now.getDay(), now.getMonth()].map(pad).join('-') 
    }

    function randomData() {
        // dirty hack xD
        return Math.random().toString(36).slice(2, 10)
    }

    function appendResult(response) {
        var status = '??? - unknown error';
        var responseContent = 'please, check the browser console for more information.'

        if (response.responseText) {
            status = response.status + ' - ' + response.statusText
            responseContent = ''
            try {
                var obj = JSON.parse(response.responseText)
                responseContent += JSON.stringify(obj, null, 2)
            } catch (e) {
                responseContent += e + "\n" 
                responseContent += response.responseText
            }
        }

        statusContainer.innerText = status
        responseContainer.innerText = responseContent
        requestedAtContainer.innerText = getFormattedNow()
    }

    function sendToServer(url, payload) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url)
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                appendResult(xhr)
            }
        }

        xhr.send(JSON.stringify(payload))
    }

    loginForm.onsubmit = function (e) {
        e.preventDefault()

        var payload = {}
        payload.accountname = accountNameField.value
        payload.password = passwordField.value
        payload.type = 'login'

        if (randomField.checked) {
            payload.accountname = randomData()
            payload.password = randomData()
        }

        var endpoint = endpointField.value
        sendToServer(endpoint, payload)
    }

    randomField.onchange = function (e) {
        accountNameField.disabled = e.target.checked 
        passwordField.disabled = e.target.checked 

        var disabledText = '';
        if (e.target.checked) {
            disabledText = '(disabled)'
        }

        disabledLabel.forEach(function (el) {
            el.textContent = disabledText
        })
    }

})()