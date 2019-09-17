$(document).ready(function() {
    // var self = this;
    //var notiTabOpened = false;
   // var notiCount = window.localStorage.getItem('notiCount');
   let notiCount,nodeItems ;
   $.post('/subscribe/getNotifs',
    {},
    function(data,status){
      if(status=="success"){
        console.log(data);
         notiCount = data.length;
        if(notiCount > 0) {
          //var nodeItems =  window.localStorage.getItem('nodeItems');
          $('.noti-count').html(notiCount);
          $('#nav-noti-count').css('display', 'inline-block');
          data.forEach(element => {
            let atag = $('<a>').attr({'class':'noti-a', 'href' : '/play/'+element.link}).append(element.fromName+" added a new video. Check it out.");
            let childItem = $('<li>').attr({'class': 'noti-text'}).append(atag);
            childItem = Array.prototype.slice.call(childItem);
            $('.noti-body').prepend(childItem);
            $('.noti-body .noti-text').on('click', function(evt) {
              addClickListener(evt);
            });
          });
        }
      }
    }
   );
    
    
    $('#noti-tab').click(function() {
      notiTabOpened = true;
      if(notiCount) {
        $('#nav-noti-count').fadeOut('slow');
       // $('.noti-title').css('display', 'inline-block');
      }
      $('.noti-container').toggle(300);
      return false;
    });
    
    // $('body').click(function() {
    //   $('.noti-container').hide('slow');
    //   $('.profile-section').hide('slow');
    //   notiTabOpened = false;
    // });
    
    $('.noti-container').click(function(evt) {
      evt.stopPropagation();
      return false;
    });
    
    $('.noti-body .noti-text').on('click', function(evt) {
      addClickListener(evt);
    });
    
    var addClickListener = function(evt) {
      evt.stopPropagation();
      if(!$(evt.currentTarget).hasClass('has-read')) {
        $(evt.currentTarget).addClass('has-read');
        //ajax request to mark as read
      }
    }
    
    $('.noti-footer').click(function() {
      notiCount = 0;
      //send ajax request to mark all read
      $('.noti-text').addClass('has-read');
    });
    
    // window.setInterval(function() {
    //   var randomStr = Date();
    //   var childItem = $('<li>').attr('class', 'noti-text').append("Shekhar Kumar commented on " + randomStr);
    //   childItem = Array.prototype.slice.call(childItem);
      
    //   $('.noti-body').prepend(childItem);
    //   $('.noti-body .noti-text').on('click', function(evt) {
    //     addClickListener(evt);
    //   });
      
    //   notiCount++;
    //   $('.noti-count').html(notiCount);
  
    //   if(notiTabOpened) {
    //     $('.noti-title').css('display', 'inline-block');
    //   } else {
    //     $('#nav-noti-count').css('display', 'inline-block');
    //   }
      
    //   window.localStorage.setItem('notiCount', notiCount);
    //   if(window.localStorage.getItem('nodeItems')) {
    //     childItem.concat(window.localStorage.getItem('nodeItems'));
    //   }
    //   window.localStorage.setItem('nodeItems', childItem);
    // }, 10000);

    $('#profile-button').click(function(){
        $('.profile-section').toggle(300);
        return false;
    });

    $('.profile-section').click(function(evt) {
      // evt.stopPropagation();
      // return false;
    });

    // $('.profile-section').focusout(function(){
    //     $(this).hide();
    //     console.log("should alse work");
    // });
    // $(document).not(".profile-section").click(function(){
    //     $('.profile-section').hide();
    //     console.log("should hide");
    // });


  });


