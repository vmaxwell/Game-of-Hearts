var MyTextPlayer = function (name, ui_div) {
	var match = null;
    var position = null;
    var current_game = null;
    var player_key = null;
	
	var num_selected = 0;
	var num_played = 0;
	var isGameStartEvent = false;

    var ui_message_log = $("<div class='text_player_message_log'></div>");
	var ui_cards = $("<div class='text_player_cards'></div>");
	var ui_button = $("<button type='button'>Ready!</button>");

    $(ui_div).append(ui_message_log);
	$(ui_div).append(ui_button);
	$(ui_div).append(ui_cards);

    this.setupMatch = function (hearts_match, pos) {
		match = hearts_match;
		position = pos;
    }
    
    this.getName = function () {
		return name;
    }

    this.setupNextGame = function (game_of_hearts, pkey) {
		current_game = game_of_hearts;
		player_key = pkey;
		//var isGameStartEvent = false;
		
		$(".text_player_cards").on("click", 'img', clickOne);
		
		$("button").on("click", buttonClick);
		
		game_of_hearts.registerEventHandler(Hearts.GAME_STARTED_EVENT, function (e) {
			isGameStartEvent = true;
			
			ui_message_log.text("Pass 3 cards");
			var hand = current_game.getHand(player_key);
			var cardsInHand = hand.getDealtCards(player_key);
			sortCards(cardsInHand);
			var index = 0;
			cardsInHand.forEach(function (card) {
				var cardImg = $('<img id="' + index + '" src="card-images/' + card.getRank() + card.getSuit() + '.png">');
				$(ui_cards).append(cardImg);
				index++;
			});
		});
		
		game_of_hearts.registerEventHandler(Hearts.TRICK_START_EVENT, function (e) {
			var position = e.getStartPos();
			
			$("#north-player").css("background-color", "white");
			$("#east-player").css("background-color", "white");
			$("#west-player").css("background-color", "white");
			$("#south-player").css("background-color", "white");
			
			if(position == "North") {
				$("#north-player > h3").css("color", "red");
				ui_message_log.text("Start the game by playing the 2 of clubs");
				var hand = current_game.getHand(player_key);
				var cardsInHand = hand.getUnplayedCards(player_key);
				sortCards(cardsInHand);
				displayPlayable(hand, cardsInHand, player_key);
				//alert("num selected: " + num_selected);
			} else if(position == "East") {
				$("#east-player > h3").css("color", "red");
			} else if(position == "West") {
				$("#west-player > h3").css("color", "red");
			} else if(position == "South") {
				$("#south-player > h3").css("color", "red");
			}
		});
		
		game_of_hearts.registerEventHandler(Hearts.CARD_PLAYED_EVENT, function (e) {
			var pos = e.getPosition();
			var cardPlayed = e.getCard();
			
			if(pos == Hearts.NORTH) {
				num_played++;
				$("#north-player > h3").css("color", "black");
				$(".playable").toggleClass("playable", false);
			} else if(pos == Hearts.EAST) {
				var cardImg = $('<img id="east-card" src="card-images/' + cardPlayed.getRank() + cardPlayed.getSuit() + '.png">');
				$("#east-player").append(cardImg);
				$("#east-player > h3").css("color", "black");
			} else if(pos == Hearts.WEST) {
				var cardImg = $('<img id="west-card" src="card-images/' + cardPlayed.getRank() + cardPlayed.getSuit() + '.png">');
				$("#west-player").append(cardImg);
				$("#west-player > h3").css("color", "black");
			} else if(pos == Hearts.SOUTH) {
				var cardImg = $('<img id="south-card" src="card-images/' + cardPlayed.getRank() + cardPlayed.getSuit() + '.png">');
				$("#south-player").append(cardImg);
				$("#south-player > h3").css("color", "black");
			}
		});
		
		game_of_hearts.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, function (e) {
			var nextPos = e.getNextPos();
			
			if(nextPos == Hearts.NORTH) {
				$("#north-player > h3").css("color", "red");
				
				ui_message_log.text("Choose a card to play");
				var hand = current_game.getHand(player_key);
				var cardsInHand = hand.getUnplayedCards(player_key);
				sortCards(cardsInHand);
				//alert("Hand length: " + cardsInHand.length);
				displayPlayable(hand, cardsInHand, player_key);
				//alert("num_selected: " + num_selected);
			} else if(nextPos == Hearts.EAST) {
				$("#east-player > h3").css("color", "red");
			} else if(nextPos == Hearts.WEST) {
				$("#west-player > h3").css("color", "red");
			} else if(nextPos == Hearts.SOUTH) {
				$("#south-player > h3").css("color", "red");
			}
		});
		
		game_of_hearts.registerEventHandler(Hearts.TRICK_COMPLETE_EVENT, function (e) {
			var trick = e.getTrick();
			var winPos = trick.getWinner();
			
			if(winPos == Hearts.NORTH) {
				$("#north-player").css("background-color", "#00ff00");
			} else if(winPos == Hearts.EAST) {
				$("#east-player").css("background-color", "#00ff00");
			} else if(winPos == Hearts.WEST) {
				$("#west-player").css("background-color", "#00ff00");
			} else if(winPos == Hearts.SOUTH) {
				$("#south-player").css("background-color", "#00ff00");
			}
			
			$(".text_player_cards").empty();
			insertCardImgs(ui_cards);
			
			$("#east-card").remove();
			$("#west-card").remove();
			$("#south-card").remove();
		});
		
		game_of_hearts.registerEventHandler(Hearts.GAME_OVER_EVENT, function (e) {
			$(".text_player_cards").off("click", 'img', clickOne);
			$("button").off("click", buttonClick);
			
			var northScore = current_game.getScore(Hearts.NORTH);
			var eastScore = current_game.getScore(Hearts.EAST);
			var westScore = current_game.getScore(Hearts.WEST);
			var southScore = current_game.getScore(Hearts.SOUTH);
			
			$("#north-player > h3").text("North Player: " + northScore);
			$("#east-player > h3").text("East Player: " + eastScore);
			$("#west-player > h3").text("West Player: " + westScore);
			$("#south-player > h3").text("South Player: " + southScore);
			
			if(northScore >= 100 || eastScore >=100 || westScore >= 100 || southScore >= 100) {
				if(northScore < eastScore && northScore < westScore && northScore < southScore) {
					$("#north-player > h3").text("Winner! North Player: " + northScore);
				} else if(eastScore < northScore && eastScore < westScore && eastScore < southScore) {
					$("#east-player > h3").text("Winner! East Player: " + eastScore);
				} else if(westScore < northScore && westScore < eastScore && westScore < southScore) {
					$("#west-player > h3").text("Winner! West Player: " + westScore);
				} else if(southScore < northScore && southScore < eastScore && southScore < westScore) {
					$("#south-player > h3").text("Winner! South Player: " + southScore);
				}
			}
		});
		
		game_of_hearts.registerEventHandler(Hearts.ALL_EVENTS, function (e) {
			ui_message_log.text(e.toString());
		});
    }
	
	var message_log_append = function (msg) {
		ui_message_log.append($(msg));
		ui_message_log.scrollTop(ui_message_log.prop("scrollHeight")-ui_message_log.height());
    }
	
	var sortCards = function (cards) {
		cards.sort(function (a, b) {
			if(a.getSuit() != b.getSuit()) {
				return b.getSuit() - a.getSuit();
			} else {
				return a.getRank() - b.getRank();
			}
		});
	}
	
	var displayPlayable = function (hand, cards, playerKey) {
		var playable = hand.getPlayableCards(playerKey);
		playable.forEach(function (card) {
			var i = cards.indexOf(card);
			//alert("card index: " + cards.indexOf(card) + "; index + 1: " + i);
			$("#" + i).toggleClass("playable", true);
		});
	}
	
	var clickOne = function () {
		//alert(isGameStartEvent);
		if(isGameStartEvent) {
			if(num_selected < 3 && !$(this).hasClass("selected")) {
				$(this).toggleClass("selected", true);
				num_selected++;
			} else if($(this).hasClass("selected")) {
				$(this).toggleClass("selected", false);
				num_selected--;
			}
		} else {
			if(num_selected < 1 && !$(this).hasClass("selected") && $(this).hasClass("playable")) {
				$(this).toggleClass("playable", false);
				$(this).toggleClass("selected", true);
				num_selected++;
			} else if($(this).hasClass("selected")) {
				$(this).toggleClass("selected", false);
				$(this).toggleClass("playable", true);
				num_selected--;
			}
		}
	}
	
	var buttonClick = function () {
		if(isGameStartEvent) {
			var hand1 = current_game.getHand(player_key);
			var cardsInHand = hand1.getDealtCards(player_key);
			sortCards(cardsInHand);
			if(num_selected == 3) {
				var i1 = $(".selected:eq(0)").attr("id");
				var i2 = $(".selected:eq(1)").attr("id");
				var i3 = $(".selected:eq(2)").attr("id");
					
				var card1 = cardsInHand[i1];
				var card2 = cardsInHand[i2];
				var card3 = cardsInHand[i3];
					
				var cardsPassing = [card1, card2, card3];
				current_game.passCards(cardsPassing, player_key);
				num_selected = 0;
				isGameStartEvent = false;
					
				$(".text_player_cards").empty();
					
				insertCardImgs(ui_cards);
			} else {
				alert("You need 3 cards!");
			}
				
		} else {
			if(num_selected == 1) {
				var hand1 = current_game.getHand(player_key);
				var cardsInHand = hand1.getUnplayedCards(player_key);
				sortCards(cardsInHand);
				var i1 = $(".selected").attr("id");
				var card1 = cardsInHand[i1];
				num_selected = 0;
				current_game.playCard(card1, player_key);
			}
		}
	}
	
	var insertCardImgs = function (ui) {
		var hand1 = current_game.getHand(player_key);
		var currentCards = hand1.getUnplayedCards(player_key);
		sortCards(currentCards);
					
		var index = 0;
		currentCards.forEach(function (card) {
			var cardImg = $('<img id="' + index + '" src="card-images/' + card.getRank() + card.getSuit() + '.png">');
			$(ui).append(cardImg);
				index++;
		});
	}
}