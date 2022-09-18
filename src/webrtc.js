// TODO Implement WebRTC message handling

export function handleWebRtc(){
    ws.send('permission');
    console.log('change box1');
    var othername='';
    if(localStorage.key(0) == 'self'){
        othername = 'other';
    }else{
        othername = 'self';
    }
    if(checkBox.checked){
        document.getElementById('formText').setAttribute('onsubmit','return false');
        
        console.log('check box1');
        var peer = new Peer(localStorage.key(0));
        
        console.log('connect box1');
        
        peer.on('open', function(id) {
                document.addEventListener('keydown',(event)=>{
                    if(event.key == 'Enter'){
                         console.log('My peer ID is: ' + id);
                                    var conn = peer.connect(othername);
                                    conn.on('open', function() {
                                    console.log('My peer ID is2: ' + id);   
                                    var peer_message = document.getElementById('textarea').value;
                                    conn.send(peer_message);
                                    var month=new Date().getMonth()+1;
                                    addMessageToHistory({
                                            text: peer_message,
                                            account: id,
                                            time: new Date().getFullYear()+'-'+ month + "-" + new Date().getDate() + ":" + new Date().getHours() +  ":" + new Date().getMinutes(),
                                            ifPrivate: true
                                        });                    
                                    });
                                   
                    }
                                   
                });
                document.addEventListener('keyup',(event)=>{
                    if(event.key == 'Enter'){
                        document.getElementById('textarea').value='';
                    }
                })
               

           peer.on('connection', function(conn) {             
                conn.on('open', function() {
                                        // Receive messages
                    conn.on('data', function(data) {
                    console.log(id + 'recieved' + data)
                    var month=new Date().getMonth()+1;
                    addMessageToHistory({
                                            text: data,
                                            account: othername,
                                            time: new Date().getFullYear()+'-'+ month + "-" + new Date().getDate() + ":" + new Date().getHours() +  ":" + new Date().getMinutes(),
                                            ifPrivate: true
                                        });
                                        
                                                
                    
                                                    });
                });
            });
                        
        });
     
    }else{
        console.log('close connect')
       
    }
}
 