const mongoose = require('mongoose');
const { playerSchema } = require('./player');
const { tableSchema } = require('./table');

const gameSchema = new mongoose.Schema({
    table: tableSchema,
    players: [playerSchema],
    isComplete: { type: Boolean, default: false },
    winner: playerSchema,
    iteration: { type: Number, default: 0 },
    chartData: {type: Array, default: []}
});


gameSchema.methods.generateChartData = async function(game) {

    let colors = [
        '#7262f6',
        '#63df99',
        '#343e3d',
        '#009fb7',
        '#f66262'
    ]

    if (!game) return [];

    let chartData = [];


    game.players.forEach((player, index) => {

        let tempChartData = { 
            name: player.name,
            safePoints: [0],
            lineColor: index > 4 ? 0 : colors[index]
        }

        let cumulative = 0;

        for (var breakIndex = player.breaks.length-1; breakIndex > 0; breakIndex--) {           

            // If player is in play
            if (player.isCurrent) {

                // Add safe points, not including current break to safe data
                if (breakIndex > 0 && !player.breaks[breakIndex].isFoul) cumulative += player.breaks[breakIndex].score;

                tempChartData.safePoints.push(cumulative);
                

            } else { // if player is not in play

                // Add all safe points break to safe data
                if (!player.breaks[breakIndex].isFoul) cumulative += player.breaks[breakIndex].score;

                tempChartData.safePoints.push(cumulative);

            } 

        }

        if (player.isCurrent) {

            // Create potential points data if current player
            tempChartData.potentialPoints = tempChartData.safePoints;
            tempChartData.potentialPoints = [...tempChartData.safePoints, player.score + player.breaks[0].score];

        }
        chartData.push(tempChartData);
        
    });
    return chartData;

}

const Game = mongoose.model('Game', gameSchema);


module.exports = Game;
