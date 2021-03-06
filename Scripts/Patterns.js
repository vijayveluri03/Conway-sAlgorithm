"use strict";

var patterns = {
"No Pattern" : null,
"Spaceship - Glider": SpaceShip_GliderPattern,
"Spaceship - LightWeight" : SpaceShip_LightWeightSpaceShipPattern,
"Oscillator - Blinker": Oscillator_Blinker,
"Oscillator - Toad" : Oscillator_Toad,
"Oscillator - Beacon" : Oscillator_Beacon,

"Crazy - R-pentomino" : Crazy_R_pentomino,
"Crazy - DieHard": Crazy_DieHard,
"Crazy - Acorn": Crazy_Acorn,

"From Imported Data": ImportedData,

};

const IMPORTED_DATA_KEY_NAME = "From Imported Data";

function ImportExportBlock ( x, y, alive )
{
    this.x = x;
    this.y = y;
    this.alive = alive;
}


function patternBase ()
{
    this.aliveTiles = [];

    this.AddAliveTimes = function ( x, y, alive )
    {
        // assigning default value
        if (alive === undefined) 
            alive = true;

        this.aliveTiles.push ( 
            {
                "x":x,
                "y":y,
                "alive":alive
            }
        );
    }
    this.Clear = function ()
    {
        this.aliveTiles = [];
    }
}

function SpaceShip_GliderPattern ()
{
    this.Init = function ()
    {
        console.log("Inside GliderPattern");
        this.base = new patternBase;

        this.base.AddAliveTimes ( 2, -1 );
        this.base.AddAliveTimes ( 3, -2 );
        this.base.AddAliveTimes ( 3, -3 );
        this.base.AddAliveTimes ( 2, -3 );
        this.base.AddAliveTimes ( 1, -3 );
        // console.log ( this.base.aliveTiles[0].x );
    }
}
function SpaceShip_LightWeightSpaceShipPattern ()
{
    this.Init = function ()
    {
        console.log("Inside LightWeightSpaceShipPattern");
        this.base = new patternBase;

        this.base.AddAliveTimes ( 1, -1 );
        this.base.AddAliveTimes ( 4, -1 );
        this.base.AddAliveTimes ( 5, -2 );
        this.base.AddAliveTimes ( 5, -3 );
        this.base.AddAliveTimes ( 1, -3 );
        this.base.AddAliveTimes ( 2, -4 );
        this.base.AddAliveTimes ( 3, -4 );
        this.base.AddAliveTimes ( 4, -4 );
        this.base.AddAliveTimes ( 5, -4 );
        // console.log ( this.base.aliveTiles[0].x );
    }
}

function Oscillator_Blinker ()
{
    this.Init = function ()
    {
        console.log("Inside Oscillator_Blinker");
        this.base = new patternBase;

        this.base.AddAliveTimes ( 1, -2 );
        this.base.AddAliveTimes ( 2, -2 );
        this.base.AddAliveTimes ( 3, -2 );

        // console.log ( this.base.aliveTiles[0].x );
    }
}

function Oscillator_Toad ()
{
    this.Init = function ()
    {
        console.log("Inside Oscillator_Toad");
        this.base = new patternBase;
        
        this.base.AddAliveTimes ( 2, -2 );
        this.base.AddAliveTimes ( 3, -2 );
        this.base.AddAliveTimes ( 4, -2 );
        this.base.AddAliveTimes ( 1, -3 );
        this.base.AddAliveTimes ( 2, -3 );
        this.base.AddAliveTimes ( 3, -3 );

        // console.log ( this.base.aliveTiles[0].x );
    }
}

function Oscillator_Beacon ()
{
    this.Init = function ()
    {
        console.log("Inside Oscillator_Beacon");
        this.base = new patternBase;
        
        this.base.AddAliveTimes ( 1, -1 );
        this.base.AddAliveTimes ( 2, -1 );
        this.base.AddAliveTimes ( 1, -2 );
        this.base.AddAliveTimes ( 2, -2 );
        this.base.AddAliveTimes ( 3, -3 );
        this.base.AddAliveTimes ( 4, -3 );
        this.base.AddAliveTimes ( 3, -4 );
        this.base.AddAliveTimes ( 4, -4 );


        // console.log ( this.base.aliveTiles[0].x );
    }
}

function Crazy_R_pentomino ()
{
    this.Init = function ()
    {
        console.log("Inside Crazy_R_pentomino");
        this.base = new patternBase;

        this.base.AddAliveTimes ( 2, -1 );
        this.base.AddAliveTimes ( 3, -1 );
        this.base.AddAliveTimes ( 1, -2 );
        this.base.AddAliveTimes ( 2, -2 );
        this.base.AddAliveTimes ( 2, -3 );

        // console.log ( this.base.aliveTiles[0].x );
    }
}

function Crazy_DieHard ()
{
    this.Init = function ()
    {
        console.log("Inside Crazy_DieHard");
        this.base = new patternBase;

        this.base.AddAliveTimes ( 1, -2 );
        this.base.AddAliveTimes ( 2, -2 );
        this.base.AddAliveTimes ( 2, -3 );
        this.base.AddAliveTimes ( 6, -3 );
        this.base.AddAliveTimes ( 7, -1 );
        this.base.AddAliveTimes ( 7, -3 );
        this.base.AddAliveTimes ( 8, -3 );

        // console.log ( this.base.aliveTiles[0].x );
    }
}

function Crazy_Acorn ()
{
    this.Init = function ()
    {
        console.log("Inside Crazy_Acorn");
        this.base = new patternBase;

        this.base.AddAliveTimes ( 1, -3 );
        this.base.AddAliveTimes ( 2, -3 );
        this.base.AddAliveTimes ( 2, -1 );
        this.base.AddAliveTimes ( 4, -2 );
        this.base.AddAliveTimes ( 5, -3 );
        this.base.AddAliveTimes ( 6, -3 );
        this.base.AddAliveTimes ( 7, -3 );

        // console.log ( this.base.aliveTiles[0].x );
    }
}



function ImportedData ()
{
    this.Init = function ( import_data /* array of ImportExportBlock */ )
    {
        console.log("Inside Import_Pattern");
        this.base = new patternBase;

        if ( import_data == null || import_data.length == 0 )
            return;

        for ( var i = 0; i < import_data.length; i++ )
        {
                this.base.AddAliveTimes ( import_data[i].x, import_data[i].y, import_data[i].alive );
        }

        // console.log ( this.base.aliveTiles[0].x );
    }

    this.Clear = function ( )
    {
        this.base.Clear();
    }
}

