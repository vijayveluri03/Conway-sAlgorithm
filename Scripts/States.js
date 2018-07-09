"use strict";
// Main Menu 

function SimulationState ()
{
    this.board = null;
    this.boardScaleSize = 1;

    this.Start = function() 
    {
        this.ui = new UI();
        this.ui.Init ( true );

        this.currentBoardScale = -1;
        this.ReCreateBoardWithSize ( 1, false );
        

        this.speedRange = AttachClickCallbackForDOMelements ( "speed", null );
        this.zoomRange = AttachClickCallbackForDOMelements ( "zoom", null );
        this.startStopButton = AttachClickCallbackForDOMelements ( "start", this.OnStartStopButtonPressed );
        this.nextStepButton = AttachClickCallbackForDOMelements ( "next", this.OnNextButtonPressed );
        this.resetButton = AttachClickCallbackForDOMelements ( "reset", this.OnResetButtonPressed );

        this.displaceOriginXTextField = AttachClickCallbackForDOMelements ( "DisplaceXValue" );
        this.displaceOriginYTextField = AttachClickCallbackForDOMelements ( "DisplaceYValue" );
        this.displaceOriginButton = AttachClickCallbackForDOMelements ( "SetOriginOffset", this.SetOriginOffsetButtonPressed );

        this.patternButton = AttachClickCallbackForDOMelements ( "patterns", null );

        this.smallWindowButton = AttachClickCallbackForDOMelements ( "small", function() { this.OnWindowSizeButtonPressed ("small") }.bind(this) );
        this.mediumWindowButton = AttachClickCallbackForDOMelements ( "medium", function() { this.OnWindowSizeButtonPressed ("medium") }.bind(this) );
        this.largeWindowButton = AttachClickCallbackForDOMelements ( "large", function() { this.OnWindowSizeButtonPressed ("large") }.bind(this) );

        this.exportButton = AttachClickCallbackForDOMelements ( "ExportBtn", function() { this.OnExportImportClearRadioPressed ("Export") }.bind(this) );
        this.importButton = AttachClickCallbackForDOMelements ( "ImportBtn", function() { this.OnExportImportClearRadioPressed ("Import") }.bind(this) );
        this.clearButton = AttachClickCallbackForDOMelements ( "ClearBtn", function() { this.OnExportImportClearRadioPressed ("Clear") }.bind(this) );

        this.fromToGroup = AttachClickCallbackForDOMelements ( "CopyToGroup");
        this.exportButtonGroup = AttachClickCallbackForDOMelements ( "ExportImportButtonGroup");
        this.textAreaGroup = AttachClickCallbackForDOMelements ( "TextAreaGroup");

        this.exportImportButton = AttachClickCallbackForDOMelements ( "exportImportClearBtn", this.OnExportImportClearPressed );
        this.fromXTextField = AttachClickCallbackForDOMelements ( "FromX" );
        this.fromYTextField = AttachClickCallbackForDOMelements ( "FromY" );
        this.toXTextField = AttachClickCallbackForDOMelements ( "ToX" );
        this.toYTextField = AttachClickCallbackForDOMelements ( "ToY" );
        this.importExportTextArea = AttachClickCallbackForDOMelements ( "importExportTextArea" );

        this.AddPatternsToUI();

        this.simulationCount = document.getElementById("simulationCount");
        this.totalAliveCount = document.getElementById("alivecount");
        this.generationCount = document.getElementById("generationCount");
        this.deathCount = document.getElementById("deathCount");
        this.mousePosition = document.getElementById("MousePos");

        this.boardSize1 = document.getElementById("CellCount1");
        this.boardSize2 = document.getElementById("CellCount2");

        this.OnSpeedChanged();
        this.OnZoomChanged();

        this.OnWindowSizeButtonPressed("small");
    }

    this.ReCreateBoardWithSize = function ( scale, refreshZoomAndSpeed )
    {
        if ( this.currentBoardScale != scale )
        {
            this.currentBoardScale = scale;

            this.board = new Board();
            this.board.Init ( 75 * this.currentBoardScale, 50 * this.currentBoardScale);

            if ( refreshZoomAndSpeed )
            {
                this.OnSpeedChanged();
                this.OnZoomChanged();
                this.OnPatternSelected();
            }
        }
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
        this.boardSize1.innerHTML = "(" + (this.board.GetRowSize() - 1) + ", " + (this.board.GetColSize() - 1) + ")";   // am just doing -1 for visual purpose
        this.boardSize2.innerHTML = this.boardSize1.innerHTML;
    }

    this.OnMouseDown = function( x, y )
    {
        this.ui.OnMouseDown ( x, y );

        this.board.OnMouseDown ( x, y );
    }
    this.OnMouseMove = function ( x, y, isMousePressed )
    {
        this.ui.OnMouseMove( x, y, isMousePressed) ;
        this.board.OnMouseMove ( x, y, isMousePressed );
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
    }.bind( this )

    this.OnPatternSelected = function() 
    {
        var value = this.patternButton.value;

        console.log ( "OnPatternSelected:" + value );

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

    this.OnExportImportClearRadioPressed = function ( e )
    {
        this.fromToGroup.style.display = "none";
        this.exportButtonGroup.style.display = "none";
        this.textAreaGroup.style.display = "none";
        
        if ( e == "Export")
        {
            this.fromToGroup.style.display = "inline";
            this.exportButtonGroup.style.display = "inline";
            this.textAreaGroup.style.display = "inline";

            this.exportImportButton.innerHTML = "Export";
        }
        else if ( e == "Import")
        {
            this.exportButtonGroup.style.display = "inline";
            this.textAreaGroup.style.display = "inline";

            this.exportImportButton.innerHTML = "Import";
        }
        else if ( e == "Clear")
        {
            this.fromToGroup.style.display = "inline";
            this.exportButtonGroup.style.display = "inline";

            this.exportImportButton.innerHTML = "Clear";
        }
        this.currentRadioButtonSelected = e;

    }.bind(this)

    this.OnExportImportClearPressed = function ( e )
    {
        if ( this.currentRadioButtonSelected == "Export")
        {
            // var hello = [];
            // hello.push ( 
            //     {
            //         "x":1,
            //         "y":2,
            //         "alive":true
            //     }
            // );
            // hello.push ( 
            //     {
            //         "x":3,
            //         "y":2,
            //         "alive":false
            //     }
            // );

            var x1 = parseInt(this.fromXTextField.value);
            var y1 = parseInt(this.fromYTextField.value);
            var x2 = parseInt(this.toXTextField.value);
            var y2 = parseInt(this.toYTextField.value);

            var dataReadyForImport = this.board.GetDataForExport ( 
                x1 < x2 ? x1 : x2,
                y1 < y2 ? y1 : y2,
                x1 < x2 ? x2 : x1,
                y1 < y2 ? y2 : y1,
                x1,
                y2
            );

            importExportTextArea.value = JSON.stringify(dataReadyForImport);
        }
        else if ( this.currentRadioButtonSelected == "Import")
        {
            var importedData =  JSON.parse(importExportTextArea.value);
            //alert(hello1[1].x + " " + hello1[1].y);
            this.CopyDataToImportPattern(importedData);
        }
        else if ( this.currentRadioButtonSelected == "Clear")
        {
            var x1 = parseInt(this.fromXTextField.value);
            var y1 = parseInt(this.fromYTextField.value);
            var x2 = parseInt(this.toXTextField.value);
            var y2 = parseInt(this.toYTextField.value);

            var dataReadyForImport = this.board.ClearDataWithInBounds ( 
                x1 < x2 ? x1 : x2,
                y1 < y2 ? y1 : y2,
                x1 < x2 ? x2 : x1,
                y1 < y2 ? y2 : y1,
            );

        }
    }.bind(this)

    
    this.SetOriginOffsetButtonPressed = function ( e )
    {
        console.log("SetOriginOffsetButtonPressed" + this.displaceOriginXTextField.value + "," + this.displaceOriginYTextField.value);
        this.board.SetOriginOffset( parseInt ( this.displaceOriginXTextField.value ), parseInt( this.displaceOriginYTextField.value));
    }.bind( this )

    this.OnWindowSizeButtonPressed = function ( e )
    {
        if ( e == "small")
        {
            this.smallWindowButton.className = "button_disabled";
            this.mediumWindowButton.className = "button_enabled";
            this.largeWindowButton.className = "button_enabled";
            SetWindowScaleSize(1.0);
            this.ReCreateBoardWithSize(1.0, true );
        }
        else if ( e == "medium")
        {
            this.smallWindowButton.className = "button_enabled";
            this.mediumWindowButton.className = "button_disabled";
            this.largeWindowButton.className = "button_enabled";
            SetWindowScaleSize(1.35);
            this.ReCreateBoardWithSize(3.0, true );
        }
        else if ( e == "large")
        {
            this.smallWindowButton.className = "button_enabled";
            this.mediumWindowButton.className = "button_enabled";
            this.largeWindowButton.className = "button_disabled";
            SetWindowScaleSize(1.75);
            this.ReCreateBoardWithSize(4.0, true );
        }

    }.bind ( this )


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
                //console.log("gre:"+gre);
                 let le = new gre();
                 patterns[pattern] = le;
                 patterns[pattern].Init();
            }
        }
    }

    this.CopyDataToImportPattern = function( importedData )
    {
        var importPatternObj = patterns[IMPORTED_DATA_KEY_NAME];
        importPatternObj.Clear();
        importPatternObj.Init(importedData);
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
    this.currentRadioButtonSelected = "";
}
