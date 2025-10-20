function _lockin() {
    setTimeout(() => {
        document.querySelector("#lockin").style.opacity -= 0.01
        if (document.querySelector("#lockin").style.opacity > 0) {
            _lockin()
        }
    }, 15)
}

function lockin() {
    document.querySelector("#lockin").style.opacity = 1
    _lockin()
}
