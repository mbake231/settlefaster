var players = [];
var clock;
var numPlayersMaster;
var game;
var isPaused=false;



function buildGame()
{
	var numPlayers = document.getElementById("numPlayers").value;
	var totalTime = document.getElementById("length").value;
	var friendlyTrade = null;//document.getElementById("fTrade").checked;

	var gameInfo = {numPlayers:numPlayers, minPerPlayer:(totalTime/numPlayers)*60, friendlyTrade:friendlyTrade};
	numPlayersMaster = numPlayers;
	return gameInfo;

};


function settleFast(g)
{

	 game = buildGame();

		document.getElementById("setup").style.display = 'none';


	for (i = 0; i <game.numPlayers; i++)
		document.getElementById("ptime"+(i).toString()).innerHTML = secToMin(game.minPerPlayer);



	//unhide right number of player info
	for (i=0; i<numPlayersMaster;i++)
	{

	document.getElementById("p"+(i+1).toString()).className =
   		document.getElementById("p"+(i+1).toString()).className.replace
      		( /(?:^|\s)hidden(?!\S)/g , '' );
     }

     document.getElementById("infobut").className =
   		document.getElementById("infobut").className.replace
      		( /(?:^|\s)hidden(?!\S)/g , '' );
/* code wrapped for readability - above is all one statement */
	
};

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    clock = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
};

function secToMin(sec)
{
	var min = Math.floor(sec/60);
	var sec = sec%60;
	if (sec < 10)
		sec = "0"+sec;
	return min+":"+sec;
}

function noName(){
	for (i = 0; i <game.numPlayers; i++)
	{
		document.getElementById("n"+(i+1).toString()).style.border = "3px solid blue";
	}

}

function startGame()
{
	//check for blank names
	
	for (i = 1; i<numPlayersMaster; i++)
	{
	if (document.getElementById("n"+(i).toString()).value == null || document.getElementById("n"+(i).toString()).value == "")
		{
			noName();
			return false;
		}
	}

	//load player info
	for (i = 0; i <game.numPlayers; i++)
	{
		players.push(player(document.getElementById("n"+(i+1).toString()).value, document.getElementById("c"+(i+1).toString()).value, game.minPerPlayer));
	}
	//set HTML player names & color
	for (i = 0; i <game.numPlayers; i++)
	{
		document.getElementById("pname"+(i).toString()).innerHTML = players[i].name;
		document.getElementById("pname"+(i).toString()).style.backgroundColor = players[i].color;

	}

	//hide info again now that we dont needed
	document.getElementById("playerInfo").className += " hidden";

	//unhide the player box
	for (i=0; i<numPlayersMaster;i++)
	{

	document.getElementById("player"+(i).toString()).className =
   		document.getElementById("player"+(i).toString()).className.replace
      		( /(?:^|\s)hidden(?!\S)/g , '' );
     }
     //unhide start button
     document.getElementById("start").className =
   		document.getElementById("start").className.replace
      		( /(?:^|\s)hidden(?!\S)/g , '' );

     return false;
}

function pauseTurn(n) {

	if (isPaused == true)
	{
		console.log("unpausing");

		//back to styling unpaused
		document.getElementById("ptime"+(n).toString()).style.color = "black";
		document.getElementById("paused").src='pause.png';

		//change pause state
		isPaused == false;

		//use turn master by making it think that person before me just ended turn to start clock again
		turnMaster(getPlayerBefore(n));

		return 0;
	}

	if (isPaused == false)
	{
		console.log("pausing");
		//save time to temp
		var temp = document.getElementById("ptime" + (n).toString() ).innerHTML;
		//stop clock
		clearInterval(clock);
		//update player time remaining
		players[n].timeRemaining = convertToSeconds(temp);
		//show html time remaining
		document.getElementById("ptime"+(n).toString()).innerHTML = temp;

		//chnage icon & color to paused state 
		document.getElementById("paused").src='play.png';
		document.getElementById("ptime"+(n).toString()).style.color = "gray";

		//set status
		isPaused = true;
		return 0;
	}

	

};

function getPlayerBefore (p){

	if (p != 0)
		return p-1;

	return numPlayersMaster-1;

}

function start(n)
{	
	//set current player
	document.getElementById("currentplayer").innerHTML = n;
	//hide start button
	document.getElementById("start").className += " hidden";

      //unhide end turn button
      document.getElementById("endGlobe").className =
   		document.getElementById("endGlobe").className.replace
      		( /(?:^|\s)hidden(?!\S)/g , '' );

      //unhide pause button
      document.getElementById("paused").className =
   		document.getElementById("paused").className.replace
      		( /(?:^|\s)hidden(?!\S)/g , '' );

	//set active user to bloack
	document.getElementById("ptime"+(n).toString()).style.color = "black";


	startTimer(players[n].timeRemaining, document.getElementById("ptime"+(n).toString()));

	return false;
};


function turnMaster(p){

	//unpausing to be sure
	isPaused = false;

	var calc = numPlayersMaster;
	calc = calc - 1;
	if (p == calc)
	{
		start(0);
		return false;
	}
	start(p+1);

	return false;
};

function endTurn(p)
{	

	var temp = document.getElementById("ptime" + (p).toString() ).innerHTML;
	clearInterval(clock);
	players[p].timeRemaining = convertToSeconds(temp);
	document.getElementById("ptime"+(p).toString()).innerHTML = temp;

	//set my color back to white
	document.getElementById("ptime"+(p).toString()).style.color = "white";

	turnMaster(p);
	return false;

};

function convertToSeconds(str)
{
	var min = parseInt(str.substring(0,2));
	var sec = parseInt(str.substring(3,5));
	var total = (min * 60) + sec;


	return (total);
};

function player(pName,pColor,ptimePerPlayer)
{
	var name = pName;
	var color = pColor;
	var time = ptimePerPlayer;
	var timeRemaining = ptimePerPlayer;

	var p = {name,color,time,timeRemaining};
	return p;

};

