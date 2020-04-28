window.onload = function () {
    // Bookmarks
    const bookmarks = document.getElementsByClassName('bookmark');
    [...bookmarks].forEach(bookmark => {
        bookmark.style.cursor = 'pointer'
        bookmark.addEventListener('click', function (e) {
            let target = e.target.parentElement

            let headers = new Headers()
            headers.append('Accept', 'Application/JSON')

            let req = new Request(`/api/bookmark/${target.dataset.post}`, {
                method: 'GET',
                mode: 'cors',
                headers
            })

            fetch(req)
                .then(res => res.json())
                .then(data => {
                    if (data.bookmark) {
                        target.innerHTML = '<i class="fas fa-bookmark"></i>'
                    } else {
                        target.innerHTML = '<i class="far fa-bookmark"></i>'
                    }
                })
                .catch(e => {
                    console.error(e.response.data);
                    alert(e.response.data.error)
                })
        })
    })

    // Like and Dislike
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

    // Comment and Reply
    const comment = document.getElementById('comment')
    const commentHolder = document.getElementById('comment-holder')

    comment.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            if (e.target.value) {
                let postId = comment.dataset.post
                let data = {
                    body: e.target.value
                }

                let req = generateRequest(`/api/comment/${postId}`, 'POST', data)
                fetch(req)
                    .then(res => res.json())
                    .then(data => {
                        let commentElement = createComment(data)
                        commentHolder.insertBefore(commentElement, commentHolder.children[0])
                        e.target.value = ''
                    })
                    .catch(e => {
                        console.log(e)
                        alert(e)
                    })

            } else {
                alert("Please Enter A valid Comment")
            }
        }
    })

    commentHolder.addEventListener('keypress', function (e) {
        if (commentHolder.hasChildNodes(e.target)) {
            if (e.key === 'Enter') {
                let commentId = e.target.dataset.comment
                let value = e.target.value

                if (value) {
                    let data = {
                        body: value
                    }
                    let req = new generateRequest(`/api/comment/reply/${commentId}`, 'POST', data)
                    fetch(req)
                        .then(res => res.json())
                        .then(data => {
                            let replyElement = createReplyElement(data)
                            let parent = e.target.parentElement
                            parent.previousElementSibling.appendChild(replyElement)

                            e.target.value = ''
                        })
                        .catch(e => {
                            console.log(e)
                            alert(e.message)
                        })

                } else {
                    alert('Please Enter A Valid Reply')
                }
            }
        }
    })

}


// Comment Related Function


function generateRequest(url, method, body) {
    let headers = new Headers()
    headers.append('Accept', 'Application/JSON')
    headers.append('Content-Type', 'Application/JSON')

    let req = new Request(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : '',
        mode: 'cors',
    })

    return req
}

function createComment(comment) {
    let innerHTML = `
    <img src="${comment.user.profilePic}" class="rounded circle m-3" style="width: 40px" alt="" />
    <div class="media-body my-3">
        <p>${comment.body}</p>

        <div class="my-3 mr-2">
            <input type="text" class="form-control" placeholder="Press Enter to Reply" name="reply" data-comment="${comment._id}" />

        </div>
    </div>`

    let div = document.createElement('div')
    div.className = 'media border my-2'
    div.innerHTML = innerHTML

    return div
}

function createReplyElement (reply) {
    let innerHTML = `
    <img src="${reply.profilePic}" class="rounded-circle m-3" style="width: 40px" alt="" />
    <div class="media-body my-3">
        <p>${reply.body}</p>
    </div>`

    let div = document.createElement('div')
    div.className = 'media mt-3'
    div.innerHTML = innerHTML

    return div
}
