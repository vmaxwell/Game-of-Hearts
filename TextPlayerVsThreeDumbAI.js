$(document).ready(function () {
    var north = new MyTextPlayer("Alice", $("#north_player")[0]);
    var east = new DumbAI("Bob")
    var south = new DumbAI("Carol");
    var west = new DumbAI("David");

    var match = new HeartsMatch(north, east, south, west);

    match.run();
});

