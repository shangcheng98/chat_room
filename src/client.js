//write your code only in this file!
import './index.css';
import './giphy.css';
import './webrtc.css';
import '../lib/check/check.css'

import {api_key,user ,getGaphy} from './giphy';
import loadCheckWords from '../lib/check/check.ts';
//import {handleWebRtc} from './webrtc';
//import { peerConn ,peer} from './webrtc';

var ws = new WebSocket("ws://134.169.47.239:80/ws");
// var ifcheck = document.getElementById('ssm').checked
// console.log(ifcheck);
 

var notification = new Notification("this is the message");

// notification
Notification.requestPermission( function(status) {
  //console.log(status);
  var n = new Notification("title", {body: "notification body"});
});

    if(localStorage.length == 0){
        var Benutzername  = prompt("Benutzername ?");
         
        if (Benutzername == 'cai'){
            localStorage.setItem('self', 'cai');
            alert("welcome "+Benutzername);
        }else{
            localStorage.setItem('other',Benutzername);
            alert("welcome "+Benutzername);
        }

    }else{
        Benutzername = localStorage.getItem(localStorage.key(0))
    }

function getEnter(){
    ws.send('typing');
   
      
}
    
ws.addEventListener('open',function(){
    console.log('connection')

});
   // console.log(ws)
    //get message from server
    new Promise(function(resolve,reject){
                    
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {

            if(xhr.readyState === 4 ){

                if(xhr.status === 200){
                    resolve(xhr.responseText);
                     
                }else{
                    reject();
                }
            }
        }
        
        xhr.open("GET", "/savedMessages");
       
      
        xhr.send();
       
        

    }).then(function(data){
        let local_message = JSON.parse(data);
        if(local_message){
            var user = localStorage.key(0);
        }
         
        document.getElementById('textarea').name = user;
        console.log('msg',local_message);
        
        for(let messageArray of local_message){

            //    if(Object.entries(messageArray)[0][0] == "self" || Object.entries(messageArray)[0][0] == "other")      
            //     ws.send(Object.entries(messageArray));

                for(let i = 0;i<Object.entries(messageArray).length;i++){
                    if(Object.entries(messageArray)[i][0] == "self" || Object.entries(messageArray)[i][0] == "other"){
                          ws.send(Object.entries(messageArray)[i]);
                           
                    }    
                }

          
        }   

    }).catch(function(){
        // console.log("warning");

    });



function checkUrl(str){

    var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp = new RegExp(Expression);
    if (Expression.test(str)) {
        return true;
    } else {
        return false;
    }


}

function getMessage(event){
    let timer;
    const waitTime = 2000;
    const text = event.currentTarget.value;

    // Clear timer
    clearTimeout(timer);

    // Wait for X ms and then process the request
    timer = setTimeout(() => {
        ws.send("noLongerTyping");
    }, waitTime);
}

    function addMessageToHistory({ text, account ,time=new Date(), ifPrivate}) {

        //TODO implement this function
        var template = document.querySelector('#template_msg');
        var gifShow = document.createElement('img');
        var gifShow2 = document.createElement('img');
        if(checkUrl(text)){
            gifShow.setAttribute('src',text);
            gifShow2.setAttribute('src',text);
            template.content.firstElementChild.querySelector('p').innerText = '';
            template.content.lastElementChild.querySelector('p').innerText = '';

            template.content.lastElementChild.querySelector('p').appendChild(gifShow);

            template.content.firstElementChild.querySelector('p').appendChild(gifShow2);
            
       
        }else{
            template.content.firstElementChild.querySelector('p').innerHTML = text;
            template.content.lastElementChild.querySelector('p').innerHTML = text;
        }
        
        template.content.firstElementChild.querySelector('time').innerHTML = time;
        template.content.lastElementChild.querySelector('time').innerHTML = time;

        if(account == 'self'){
            var clone = document.importNode(template.content.firstElementChild,true)//clone the which child from template
        }else{
            var clone = document.importNode(template.content.lastElementChild,true)//clone the which child from template
        }
        if(ifPrivate == true){
            clone.classList.add("private");
            document.querySelector("ol").appendChild(clone);
        }else{
            document.querySelector("ol").appendChild(clone);
        }

    }

    ws.onmessage = (msg) => {
     
       // console.log(msg.data);
        //let data = JSON.parse(msg.data)["payload"];
       let data = msg.data;
        if(data == "noLongerTyping" || data == "typing"){
            document.getElementById("typing").innerText= data;
            if(data == 'typing'){
                let img = document.createElement('img');
                img.setAttribute('src','https://www.ibr.cs.tu-bs.de/users/mahhouk/wbs/dots.gif');
                document.getElementById("typing").append(img);
            }
            
             
        }else if(data =='permission'){
            var checkInput = document.getElementById('ssm');
         
            alert('someone open the private chat , click button and join him');
                            
        }else if(data != null){
            
            document.getElementById("typing").innerHTML = "message";
            var month=new Date().getMonth()+1;
            
            addMessageToHistory({
                text: data.split(",")[1],
                account: data.split(",")[0],
                time: new Date().getFullYear()+'-'+ month + "-" + new Date().getDate() + ":" + new Date().getHours() +  ":" + new Date().getMinutes(),
                ifPrivate: false
            });
        }
        //get message from server
    };



 


    document.addEventListener('keyup',(event) =>{
        getMessage(event);
        
    });

//from Giphy.js


document.addEventListener('keyup',(event) =>{
        var input = document.querySelector('.textarea').value.trim();
        getEnter();
        
        if(input.slice(0,4)== "@gif"){
            let gifInput = input.slice(5,input.length);
            document.getElementById('gifholder').style.visibility = "visible";
            getGaphy(gifInput);
        }
    
});



//peer
var checkBox = document.getElementById('ssm');
checkBox.addEventListener('change',handleWebRtc);

function handleWebRtc(){
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
                                    console.log(peer_message);
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
 
    
 

// checkts
 
loadCheckWords();
