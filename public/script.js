const socket = io(); // to create connect with a server 

$('#chat-box').hide()

$('#send-btn').on('click',()=>{
   const msgText = $('#inp').val();
    // console.log(msgText);
    if(!msgText){
        return
    }else{
        // here 'send-msg' is user-defined u can give any name to it
        socket.emit('send-msg',{     // emit accept the event
            msg: msgText
        })
    }

   $('#inp').val("")
})

socket.on('received-msg',(data)=>{ // listen to server msg
    console.log(data );
    // $('#chat').append(`<li class="border mb-2 p-2 rounded-pill"><span class="fw-bold">${data.id} </span> -> ${data.msg}</li>
    $('#chat').append(`<li class="border mb-2 p-2 rounded-pill"><span class="fw-bold">${data.username} </span> -> ${data.msg}</li>
`);
})



$('#login-btn').on('click',()=>{
    // console.log('clicked');
    const username = $('#username').val();

    socket.emit('login', {
        username:username
    })
    $('#login').hide()
    $('#chat-box').show()

    $('#username').val("")
})