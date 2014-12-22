Quintus.RacemathUI = function(Q){
	Q.UI.Text.extend("QuestionText",{
		init: function(){
			this._super({
				color: "white",
				x: 0,
				y: 0,

			});

		},
		generate: function(){

			// min + int(random(0,1) * (max - min))
			this.p.num1 = Q.state.get('operations_min') + Math.floor(Math.random() * (Q.state.get('operations_max') - Q.state.get('operations_min')));
			this.p.num2 = Q.state.get('operations_min') + Math.floor(Math.random() * (Q.state.get('operations_max') - Q.state.get('operations_min')));
			this.p.label = this.p.num1 + "x" + this.p.num2;

		},
		getAnswer: function(){
			return this.p.num1 * this.p.num2;
		}
	});
	Q.UI.Button.extend('NumberButton',{
		init: function(p){
			this._super(Q._defaults(p,{
				fill: "#fff",
				border: 2,
				shadow: 3,
				shadowColor: "rgba(0,0,0,0.5)",
				w: 40,
				h: 40

			}),
			function(){
				var currrAnsw;
				if (this.p.answerLabel.p.label === '') {
					currrAnsw = 0;

				}else{
					currrAnsw = +(this.p.answerLabel.p.label);

				}
				if (currrAnsw < 100000) {
					this.p.answerLabel.p.label = ""+ (currrAnsw * 10 + +this.p.label);
				};

			}
			);
		}
	});

	Q.scene('ui',function(stage){
		// current question
		var qContainer = stage.insert(new Q.UI.Container({
			fill: "gray",
			x: 221,
			y: 325,
			border: 2,
			shadow: 3,
			shadowColor: "rgba(0,0,0,0.5)",
			w: 140,
			h: 50
			})
		);

		var question = stage.insert(new Q.QuestionText(), qContainer);
		question.generate();

		// area de respuesta

		var aContainer = stage.insert(new Q.UI.Container({
			fill: "#438700",
			x: 221,
			y: 385,
			border: 2,
			shadow: 3,
			shadowColor: "rgba(0,0,0,0.5)",
			w: 140,
			h: 50
			})
		);
		var answer = aContainer.insert(new Q.UI.Text({
			label: "",
			color: "white",
			x: 0,
			y: 0
		}));

		// enviar respuesta
		var aButton = stage.insert(new Q.UI.Button({
			fill: "white",
			label: "Calcular",
			x: 221,
			y: 445,
			border: 2,
			shadow: 3,
			shadowColor: "rgba(0,0,0,0.5)",
			w: 140,
			h: 50
			},
			function(){
				var isCorrect = question.getAnswer() === +answer.p.label;
				//console.log(isCorrect);
				var player = Q("Player",0).first();
				if (isCorrect) {
					// incrementar vx 
					Q.audio.play('plus.mp3');
					player.p.vx +=10;
				}else{
					// disminuir vx
					Q.audio.play('less.mp3');
					player.p.vx = Math.max(0, player.p.vx -5 );
				}
				answer.p.label = '';
				question.generate();
			})

		);


		// botones
		var i;
		for (i = 1; i < 10; i++) {
			
			stage.insert(
				new Q.NumberButton(
				{
					label: i+'',
					y: 275+Math.ceil(i/3)*45,
					x: 30+parseInt((i+2)%3)*45,
					answerLabel: answer
				}
			))


		}
		stage.insert(
			new Q.NumberButton(
			{
				label: '0',
				y: 275+4*45,
				x: 30+45,
				answerLabel: answer
			}
		))

	});

}


