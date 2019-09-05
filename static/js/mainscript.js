function showStuff(element)  {
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
