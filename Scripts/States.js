"use strict";
// Main Menu 

function SimulationState ()
{
    this.board = null;

    this.Start = function() 
    {
        this.ui = new UI();
        this.ui.Init ( true );


        this.board = new Board();
        this.board.Init ( 75, 50);

        this.speedRange = AttachClickCallbackForDOMelements ( "speed", this.null );
        this.zoomRange = AttachClickCallbackForDOMelements ( "zoom", this.null );
        this.startStopButton = AttachClickCallbackForDOMelements ( "start", this.OnStartStopButtonPressed );
        this.nextStepButton = AttachClickCallbackForDOMelements ( "next", this.OnNextButtonPressed );
        this.resetButton = AttachClickCallbackForDOMelements ( "reset", this.OnResetButtonPressed );
        this.patternButton = AttachClickCallbackForDOMelements ( "patterns", null );
        this.AddPatternsToUI();

        this.simulationCount = document.getElementById("simulationCount");
        this.totalAliveCount = document.getElementById("alivecount");
        this.generationCount = document.getElementById("generationCount");
        this.deathCount = document.getElementById("deathCount");
        this.mousePosition = document.getElementById("MousePos");

        this.OnSpeedChanged(null);
        this.OnZoomChanged(null);
    }
    this.End = function () 
    {
        
    }
    this.Update = function ()
    {
        if ( !this.isSimulating )
            return;

        this.currentFrameTime += dt/1000;
        if ( this.currentFrameTime > this.executeNextFrameAfter )
        {
            this.currentFrameTime = this.currentFrameTime - this.executeNextFrameAfter;
 
            this.SimulateNextFrame();
        }

    }
    this.SimulateNextFrame = function ()
    {
        this.board.SimulateNextFrame();
        this.board.SwapWithNextFrame();
    }

    this.Render = function ()
    {
        //this.ui.Render();
        this.board.Render ( renderer );
        this.simulationCount.innerHTML = this.board.simulationFrameCount;
        this.totalAliveCount.innerHTML = this.board.totalAliveCount;
        this.generationCount.innerHTML = this.board.totalGenerationCount;
        this.deathCount.innerHTML = this.board.totalDeathCount;
        this.mousePosition.innerHTML = this.board.mousePosition != null ? ( "(" + this.board.mousePosition.x + "," + this.board.mousePosition.y + ")") : "Tap to get position";
    }

    this.OnMouseDown = function( x, y )
    {
        this.ui.OnMouseDown ( x, y );

        this.board.OnMouseDown ( x, y );
    }
    this.OnMouseUp = function( x, y )
    {
        this.ui.OnMouseUp ( x, y );

        this.board.OnMouseUp ( x, y );
    }
    this.OnKeyPress = function ( keyCode )
    {
    }
    this.OnSpeedChanged = function() 
    {
        var value = this.speedRange.value;

        this.executeNextFrameAfter = 1/value;
        this.currentFrameTime = 0;

        console.log ( "executeNextFrameAfter:" + this.executeNextFrameAfter);

        // if (value > 0 && value < 5) {
        //     alert("First");
        // } else {
        //     alert("Second");
        // }
    }.bind( this )
    this.OnZoomChanged = function() 
    {
        var value = this.zoomRange.value;

        console.log ( "OnZoomChanged:" + ( (value*1)));
        this.board.SetBlockSize( ( (value*1)) );
        // if (value > 0 && value < 5) {
        //     alert("First");
        // } else {
        //     alert("Second");
        // }
    }.bind( this )

    this.OnPatternSelected = function() 
    {
        var value = this.patternButton.value;

        console.log ( "OnPatternSelected:" + value );
        //this.board.SetBlockSize( ( (value*1)) );
        // if (value > 0 && value < 5) {
        //     alert("First");
        // } else {
        //     alert("Second");
        // }

        for ( let pattern in patterns )
        {
            if ( pattern == value )
            {
                let patternObj = patterns[pattern];
                this.board.SetPattern ( patternObj);
            }
        }

    }.bind( this )

    this.OnStartStopButtonPressed = function ( e )
    {
        if (this.startStopButton.innerHTML =="Start") 
        {
            this.isSimulating = true;
            this.startStopButton.innerHTML = "Stop";
        }
        else 
        {
            this.startStopButton.innerHTML = "Start";
            this.isSimulating = false;
        }
    }.bind( this )

    this.OnNextButtonPressed = function ( e )
    {
        if (this.startStopButton.innerHTML =="Start") 
        {
            this.SimulateNextFrame();
        }

    }.bind( this )

    this.OnResetButtonPressed = function ( e )
    {
        this.board.Reset();

        this.startStopButton.innerHTML = "Start";
        this.isSimulating = false;

    }.bind( this )


    this.AddPatternsToUI = function ()
    {
        for ( let pattern in patterns )
        {
            var option = document.createElement("option");
            option.text = pattern;
            this.patternButton.add(option); 
            if ( patterns[pattern] != null )
            {
                let gre = patterns[pattern];
                let le = new gre;
                patterns[pattern] = le;
                patterns[pattern].Init();
            }
        }
    }

    this.speedRange = null;
    this.zoomRange = null;

    this.startStopButton = null;
    this.nextStepButton = null;
    this.resetButton = null;
    this.patternButton = null;

    this.isSimulating = false;

    this.ui = null;

    this.executeNextFrameAfter = 0;
    this.currentFrameTime = 0;
    this.simulationCount = 0;
    this.totalAliveCount = 0;
    this.generationCount = 0;
    this.deathCount = 0;
}
