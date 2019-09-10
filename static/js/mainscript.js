function showStuff(element)  {  // this is for tab switching in login and sign up page
    var tabContents = document.getElementsByClassName('tabContent');
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }
    var toshow=document.getElementById(element.dataset.tab);
    toshow.style.display= 'block';
    $('.tabButton').removeClass("bg-white").removeClass("border-top-red-5");
    $('.tabButton').addClass("bg-darkgrey").addClass("font-light").addClass("border-top-1-5").addClass("border-bottom-1-5");
    element.classList.add('bg-white');
    element.classList.remove('font-light');
    element.classList.remove('border-top-1-5');
    element.classList.remove('border-bottom-1-5');
    element.classList.add('border-top-red-5');
  }

  function likeHandler(element){
    console.log("like pressed");
    if(element.dataset.pressed=="1"){
      console.log("like is pressed previously");
      element.dataset.pressed="0";
      $('#likeCounter').text((i,origValue)=>{
        //do a database call to decrease likes
        return origValue-1;
      });
      //change appearance to show unpressing action
    }
    else{
      let dbutton = document.getElementById('dislikeButton');
      if(dbutton.dataset.pressed=="1"){
        dbutton.dataset.pressed="0";
        $('#dislikeCounter').text((i,origValue)=>{
          //do a database call to decrease dislike Count
          return origValue-1;
        });
        //change button apperance to show unpressing action
      }
      console.log("reached here");
      element.dataset.pressed="1";
      $('#likeCounter').text((i,origValue)=>{
        //do a database call to increase like count
        console.log("and here");
        return origValue-1+2;
      });
      //change button to show pressed action
    }
  }

  function dislikeHandler(element){
    console.log("dislike pressed");
    if(element.dataset.pressed=="1"){
      console.log("dislike is pressed previously");
      element.dataset.pressed="0";
      $('#dislikeCounter').text((i,origValue)=>{
        //do a database call to decrease dislikes
        return origValue-1;
      });
      //change appearance to show unpressing action
    }
    else{
      let lbutton = document.getElementById('likeButton');
      if(lbutton.dataset.pressed==="1"){
        lbutton.dataset.pressed="0";
        $('#likeCounter').text((i,origValue)=>{
          //do a database call to decrease like Count
          return origValue-1;
        });
        //change button apperance to show unpressing action
      }
      element.dataset.pressed="1";
      $('#dislikeCounter').text((i,origValue)=>{
        //do a database call to increase like count
        return origValue-1+2;
      });
      //change button to show pressed action
    }
  }

  // function showCreateOption(element) {
  //   $('#createPlaylistDialog').show();
  //   $('#createPlaylistButton').hide();
  // }

  var videoSelected;

  $(document).ready(function(){
    $('.addToPlaylistButton').click(function(){
      videoSelected = $('.addToPlaylistButton').attr('data-videoid');
      $('input[type="hidden"][name="videoId"]').attr('value',videoSelected);
      $('.modal-body label>input[type="checkbox"]').prop('checked',false);
      console.log(videoSelected);
    });
  });

  function addToThisPlaylist(element){
    if(element.checked==true){
      $.post('/playlist/addToPlaylist',
              {
                videoId:videoSelected ,
                playlistId:element.value ,
              },
              function(data,status){
                console.log(data);
                console.log(status);
                $('#video-added-msg').trigger("click");
              });
    }
    else{
      $.post('/playlist/removeFromPlaylist',
              {
                videoId:videoSelected ,
                playlistId:element.value ,
              },
              function(data,status){
                console.log(data);
                console.log(status);
                $('#video-removed-msg').trigger("click");
              });
    }
  }

  function createPlaylistFun(){
    let myform = document.forms['createPlaylistForm'];
    $.post('playlist/createNew',
      {
        name : myform['name'].value ,
        privacy : myform['privacy'].value ,
        videoId : myform['videoId'].value
      },
      function(data,status){
        if(status=="success"){
          myform['name'].value="";
          $('#playlist-created-msg').trigger("click");
          $('#video-added-msg').trigger("click");
          $('#playlistModal').modal('toggle');
          $('#createPlaylistDialog').hide();
          $('#createPlaylistButton').show();
          
        }
      }
    )
  }

  function addThisToPlaylist(element){
    let email = document.getElementById('userID').dataset.id;
    console.log('clieke ' + email);
    let videoId = element.dataset.videoId;
    $.get('/playlist/getAll/'+email,
      function(data,status){
        if(status=="success"){
          let ndata;
          $('#playlistSectionInModal').html("");
          data.forEach(function(pl){
            ndata = `<div class='checkbox'>
            <label>
              <input type="checkbox" onchange="addToThisPlaylist(this)" value="`+  pl._id +`"> ` + pl.playlistName + `
            </label>
            </div>` ;
            $('#playlistSectionInModal').append(ndata);
          });
          // $('body').bootstrapMaterialDesign();
          $('#playlistModal').modal('toggle');
        }
      }
    );
  }

  function sortingHandler(element){
    let t1,t2;
    t1 = "dataset";
    if(element.dataset.type=="alphabetical"){
      t2="name";
    }
    else if(element.dataset.type=="dateuploaded"){
      t2="dateuploaded";
    }
    else{
      t2="views";
    }
    let order="dsc";
    if(element.dataset.order=="asc"){
      element.dataset.order="dsc";
      order="asc";
    }
    else{
      element.dataset.order="asc";
    }
      let list, i, switching, b, shouldSwitch;
      //list = $("#videoContainer");
      switching = true;
      /* Make a loop that will continue until
      no switching has been done: */
      while (switching) {
        // start by saying: no switching is done:
        switching = false;
        b = $("#videoContainer>li");
        // Loop through all list-items:
        for (i = 0; i < (b.length - 1); i++) {
          // start by saying there should be no switching:
          shouldSwitch = false;
          /* check if the next item should
          switch place with the current item: */
          if ((order=="asc" && (b[i][t1][t2] > b[i + 1][t1][t2])) || ((b[i][t1][t2] < b[i + 1][t1][t2]) && order=="dsc")) {
            /* if next item is alphabetically
            lower than current item, mark as a switch
            and break the loop: */
            shouldSwitch = true;
            break;
          }
          
        }
        if (shouldSwitch) {
          /* If a switch has been marked, make the switch
          and mark the switch as done: */
          b[i].parentNode.insertBefore(b[i + 1], b[i]);
          switching = true;
        }
      }
      let pid = document.getElementById('videoContainer').dataset.playlistid;
      $.post("/playlist/orderPlaylist",
        {
          playlistid : pid,
          type : element.dataset.type,
          order : order
        },
        function(data,status){
          console.log(data+"::"+status);
        }
      );
}

