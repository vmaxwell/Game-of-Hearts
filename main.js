$(document).ready(function () {
	var north = new TextPlayer("North Player", $("*north_player")[0]);
	var east = new DumbAI("East Player");
	var south = new DumbAI("South Player");
	var west = new DumbAI("West Player");
	
	var match = new HeartsMatch(north, east, south, west);
}