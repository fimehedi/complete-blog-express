window.onload = function () {
    let baseCropping = $('#cropped-image').croppie({
        viewport: {
            width: 200,
            height: 200
        },
        boundary: {
            width: 300,
            height: 300
        },
        showZoomer: true
    })

    function readableFile(file) {
        let reader = new FileReader()
        reader.onload = function (event) {
            baseCropping.croppie('bind', {
                url: event.target.result
            }).then(() => {
                $('.cr-slider').attr({
                    'min': 0.4000,
                    'max': 1.5000
                })
            })
        }
        reader.readAsDataURL(file)
    }
    $('#profile-pic-file').change(function (e) {
        e.preventDefault()
        if (this.files[0]) {
            readableFile(this.files[0])
            $('#pic-crop-modal').modal({
                backdrop: 'static',
                keyboard: false
            })
        }
    })
    $('#cancel-cropping').on('click', function (e) {
        e.preventDefault()
        $('#profile-pic-file').modal('hide')
    })
    $('#upload-image').on('click', function (e) {
        e.preventDefault()
        baseCropping.croppie('result', 'blob')
            .then(blob => {
                let formData = new FormData()
                let file = document.getElementById('profile-pic-file').files[0]
                let name = generateFileName(file.name)
                formData.append('profilePic', blob, name)
                let headers = new Headers()
                headers.append('Accept', 'Application/JSON')

                let req = new Request('/upload/profilePic', {
                    method: 'POST',
                    headers,
                    mode: 'cors',
                    body: formData
                })
                return fetch(req)
            })
            .then(res => res.json())
            .then(data => {
                document.getElementById('remove-profile-pic').style.display = "block"
                document.getElementById('profile-pic').src = data.profilePic
                document.getElementById('profile-pic-form').reset()

                $('#pic-crop-modal').modal('hide');
            })
            .catch(e => {
                console.log(e)
            })
    })

    $('#remove-profile-pic').on('click', function () {
        let req = new Request('/upload/profilePic', {
            method: 'DELETE',
            mode: 'cors'
        })

        fetch(req)
            .then(res => res.json())
            .then(data => {
                document.getElementById('remove-profile-pic').style.display = "none"
                document.getElementById('profile-pic').src = data.profilePic
                document.getElementById('profile-pic-form').reset()
            })
            .catch(e => {
                console.log(e)
                alert("Server Error Occurred")
            })

    })

}

function generateFileName(name) {
    const types = /(.jpeg || .jpg || .png || .gif)/i
    return name.replace(types, '.png')
}