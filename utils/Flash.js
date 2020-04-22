class Flash {
    constructor (req) {
        this.req = req
        this.success = this.extractFlashMessage('success')
        this.error = this.extractFlashMessage('error')
    }

    extractFlashMessage (name) {
        let message = this.req.flash(name)
        return message.length > 0 ? message[0] : false
    }

    hasMessage () {
        return !this.success && !this.error ? false : true
    }

    static getMessage (req) {
        let flash = new Flash(req)
        return {
            success: flash.success,
            error: flash.error,
            hasMessage: flash.hasMessage()
        }
    }
}

module.exports = Flash