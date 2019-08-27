var imgRobot = document.createElement("img");
imgRobot.src = "https://vignette.wikia.nocookie.net/rickandmorty/images/6/67/Butter_Robot_Picture.png";
var imgRick = document.createElement("img");
imgRick.src =  "https://vignette.wikia.nocookie.net/rickandmorty/images/a/a6/Rick_Sanchez.png";
var imgMorty = document.createElement("img");
imgMorty.src = "https://vignette.wikia.nocookie.net/rickandmorty/images/4/41/Morty_Smith.jpg";
var imgSquanchy = document.createElement("img");
imgSquanchy.src =  "https://vignette.wikia.nocookie.net/rickandmorty/images/1/16/Squanchy_.png";

setInterval( () => {
    //GET CURRENT TIME
    var time = new Date();
    var hours = time.getHours();
    var mins = time.getMinutes();
    var secs = time.getSeconds();
    var ampm = "";

    //GET DOC ELEMENTS
    var clock = document.getElementById("myJSClock");
    var mainImage = document.getElementById("mainImage");
    var rickSelector = document.getElementById("rickSelector");
    var mortySelector = document.getElementById("mortySelector");

    //GET SELECTOR VALUES
    var rickValue = rickSelector.options[rickSelector.selectedIndex].value;
    var mortyValue = mortySelector.options[mortySelector.selectedIndex].value;
    var squanchyValue = squanchySelector.options[squanchySelector.selectedIndex].value;

    //CLEAR IMAGESET
    var imageSet = new Set();
    var cNode = mainImage;
    while(cNode.firstChild)
        cNode.removeChild(cNode.firstChild);

    //ADD IMAGES TO IMAGESET
    if(rickValue == hours) imageSet.add(imgRick);
    if(mortyValue == hours) imageSet.add(imgMorty);
    if(squanchyValue == hours) imageSet.add(imgSquanchy);
    if(imageSet.size == 0) imageSet.add(imgRobot);
    imageSet.forEach(image => mainImage.appendChild(image));

    //PARSE RELEVANT TIME COMPONENTS
    if (hours < 10) hours = "0" + hours;
    if (mins < 10) mins = "0" + mins;
    if (secs < 10) secs = "0" + secs;
    if (hours > 11) ampm = "pm";
    else ampm = "am";
    if (hours > 12) hours = hours - 12;

    var dispTime = hours + ":" + mins + ":" + secs + " " + ampm;
    clock.innerText = dispTime;

    changeColor(clock);

}, 1000);

function getRandomColor() {
    var varters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += varters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function changeColor(cl) {
   cl.style.color = getRandomColor();
   if(cl.style.color === cl.style.backgroundColor)
       changeColor(cl);
}
