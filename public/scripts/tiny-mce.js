window.onload = function () {
    tinymce.init({
        selector: 'textarea#tiny-mce-post-body',
        plugins: ["a11ychecker advcode advlist link lists checklist autolink autosave code", 'preview', 'searchreplace', 'wordcount', 'media table emoticons image '],
        toolbar: 'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | forecolor backcolor emoticons | code preview',
        height: 400,
        automatic_uploads: true,
        images_upload_url: '/upload/postimage',
        relative_url: false,
        images_upload_handler: function (blobInfo, success, failure) {
            let headers = new Headers()
            headers.append('Accept', 'Application/JSON')

            let formData = new FormData()
            formData.append('post-image', blobInfo.blob(), blobInfo.filename())
            console.log(formData)

            let req = new Request('/upload/postimage', {
                method: 'POST',
                headers,
                mode: 'cors',
                body: formData
            })

            fetch(req)
                .then(res => res.json())
                .then(data => success(data.imagUrl))
                .catch(() => failure('HTTP Error'))
        }
    })
}