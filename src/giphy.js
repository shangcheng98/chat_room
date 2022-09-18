// write your Giphy-related code only in this file!
export let api_key = "j88hojI3MTvYqyaLfgVbDfi9rgIlhRVZ";
export var user = localStorage.key(0);
export var imgInfo = document.getElementById('imgInfo');
export var formGif = document.getElementById("formGif");
 

//async request for giphy api
export async function getGaphy(gifInput){
    
    fetch('http://api.giphy.com/v1/gifs/search?api_key='+api_key+'&q='+gifInput+'&limit=10')
        .then(response => response.json())
        .then(data => {
             
            var gifholder = document.getElementById('gifholder');
            gifholder.innerHTML = "";
            for (const graphys of data.data){
                //console.log(graphys.images);
                let graphy_gif = document.createElement('img');
                graphy_gif.setAttribute('type',"image");
                graphy_gif.setAttribute('name',"gifName");
                graphy_gif.setAttribute('id',"gifID");
                graphy_gif.setAttribute('src',graphys.images.fixed_height_small_still.url);
                
              //  graphy_gif.setAttribute('onclick', 'send_Gif("' + graphys.images.downsized.url + '");' );
                graphy_gif.onclick = function(){
                    imgInfo.name = user;
                    imgInfo.value = graphys.images.downsized.url;
                    formGif.submit();
                    // document soll nicht here !!!!
                }
                gifholder.appendChild(graphy_gif);
            }
        })
        
 
}

