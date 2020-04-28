window.onload = function () {
    const likeBtn = document.getElementById('likeBtn')
    const dislikeBtn = document.getElementById('dislikeBtn')

    likeBtn.addEventListener('click', function (e) {
        let postId = likeBtn.dataset.post
        reqLikeDislike('like', postId)
            .then(res => res.json())
            .then(data => {
                let likeText = data.liked ? '<i class="fas fa-thumbs-up fa-lg"></i>' : '<i class="far fa-thumbs-up fa-lg"></i>'
                likeText = likeText + ` ${data.totalLike}`
                let dislikeText = `<i class="far fa-thumbs-down fa-lg"></i> ${data.totalDislike}`

                likeBtn.innerHTML = likeText
                dislikeBtn.innerHTML = dislikeText
            })
            .catch(e => {
                console.log(e)
                alert(e.response.data.error)
            })
    })

    dislikeBtn.addEventListener('click', function (e) {
        let postId = dislikeBtn.dataset.post
        reqLikeDislike('dislike', postId)
            .then(res => res.json())
            .then(data => {
                let dislikeText = data.disliked ? '<i class="fas fa-thumbs-down fa-lg"></i>' : '<i class="far fa-thumbs-down fa-lg"></i>'
                dislikeText = dislikeText + ` ${data.totalDislike}`
                let likeText = `<i class="far fa-thumbs-up fa-lg"></i> ${data.totalLike}`

                likeBtn.innerHTML = likeText
                dislikeBtn.innerHTML = dislikeText
            })
            .catch(e => {
                console.log(e)
                alert(e.response.data.error)
            })
    })

    function reqLikeDislike(type, postId) {
        let headers = new Headers()
        headers.append('Accept', 'Application/JSON')
        headers.append('Content-Type', 'Application/JSON')

        let req = new Request(`/api/${type}/${postId}`, {
            method: 'GET',
            mode: 'cors',
            headers
        })

        return fetch(req)
    }
}