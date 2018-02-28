"use strict";
document.onkeydown = checkDown;
document.onkeyup = checkUp;

// Design data 
const renderWidth = 800;
const renderHeight = 500;
const MAX_ROWS_COLS = 9;

const scaleUp = 1.0;
const gameSpeed = 1;




// Private
let lastUpdate = Date.now();
let dt = 0;
var touchVar = null;
let isGamePaused = false;





// Loads the game up 
function loadGame() 
{
    MyApplicationInstance.Initialize();

    renderer.InitializeGraphics( MyApplicationInstance.GameWidth(), MyApplicationInstance.GameHeight() );
    renderer.ClearScreen();

    //renderer.canvas.addEventListener('click', OnMouseClicked,  false);
    renderer.canvas.addEventListener('mousedown', OnMouseDown,  false);
    renderer.canvas.addEventListener('mouseup', OnMouseUp,  false);

    InitUI( renderer );

    MyApplicationInstance.Start();

    
}
function OnImageLoaded()
{

    //alert ( "here");
}



// My application class which has all important links
var MyApplicationInstance = 
{
    gameWidth : renderWidth,
    gameHeight : renderHeight,

    currentTime : 0,

    GameWidth : function() { return renderWidth; },
    GameHeight : function() { return renderHeight; },

    StateManager : new StateManager(),

    Initialize: function ( )
    {
        this.frameNumber = 0;
        lastUpdate = Date.now();
        
        this.interval = setInterval(this.UpdateGameLoop, 0 );
    },
    Start : function () 
    {
        this.StateManager.PushState( new SimulationState() );
    },
    Restart: function () 
    {
            
        this.StateManager.ClearAll();
        this.StateManager.PushState( new SimulationState() );
    },

    // the main update method which updates everything else 
    UpdateGameLoop: function()
    {
        var now = Date.now();
        dt = now - lastUpdate;
        dt = dt * gameSpeed;
        lastUpdate = now;

        renderer.ClearScreen(); // clearing the screen 
        OnKeyPress(touchVar);   // sending touch events to the game 

        // updating and rendering the states
        if ( MyApplicationInstance.StateManager != null )
        {
            MyApplicationInstance.StateManager.Update();
            MyApplicationInstance.StateManager.Render();
        }
    }
}


// A rendering class which takes care of all rendering 
var renderer = 
{
    canvas : null,
    context : null, 
    InitializeGraphics : function( width, height ) 
    {
        this.canvas = document.getElementById("canvas-game"); // Fetching the game canvas from html
        this.canvas.width = width * scaleUp;    // the window is scaled up based on the scale we set
        this.canvas.height = height * scaleUp; // the window is scaled up based on the scale we set
        this.context = this.canvas.getContext("2d");
    },
    ClearScreen : function() 
    {
        this.context.clearRect(0, 0, this.canvas.width * scaleUp, this.canvas.height * scaleUp);
    },
    RenderBox : function( box, point = null )
    {
        this.context.fillStyle = box.color;
        if ( this.InvertYEnabled() )
        {
            this.context.fillRect((box.x - box.w/2) * scaleUp, (this.Height() - ( box.y + box.h/2 )) * scaleUp , box.w * scaleUp, box.h * scaleUp);
        }
        else
            this.context.fillRect(box.x - box.w/2, box.y - box.h/2, box.w, box.h);
    },
    RenderBox : function( box, point = null )
    {
        this.context.fillStyle = box.color;
        if ( this.InvertYEnabled() )
        {
            this.context.fillRect((box.x - box.w/2) * scaleUp, (this.Height() - ( box.y + box.h/2 ) ) * scaleUp, box.w * scaleUp, box.h * scaleUp);
        }
        else
            this.context.fillRect(box.x - box.w/2, box.y - box.h/2, box.w, box.h);
    },
    RenderButton : function ( button )
    {
        if ( button.isPressed )
            this.context.fillStyle = button.selectedColor;
        else if ( button.isDisabled )
            this.context.fillStyle = button.disabledColor;
        else    
            this.context.fillStyle = button.color;

        if ( this.InvertYEnabled() )
        {
            if ( button.image != null )
                this.context.drawImage( button.image, (button.x - button.w/2) * scaleUp, (this.Height() - ( button.y + button.h/2 )) * scaleUp , button.w * scaleUp, button.h * scaleUp);
            else
                this.context.fillRect((button.x - button.w/2) * scaleUp, (this.Height() - ( button.y + button.h/2 )) * scaleUp , button.w * scaleUp, button.h * scaleUp);
        }
        else
            this.context.fillRect(button.x - button.w/2, button.y + button.h/2, button.w, button.h);

        this.context.fillStyle = button.fontColor;
        this.context.font = button.fontType;

        if ( this.InvertYEnabled() )
        {
            this.context.fillText( button.text, button.x * scaleUp, (this.Height() - (button.y - button.fontHeightInPX/2)) * scaleUp );
        }
        else
            this.context.fillText( button.text, button.x, (button.y - button.fontHeightInPX/2));

        this.context.textAlign="center"; 
    },
    Width : function () { return MyApplicationInstance.GameWidth(); },
    Height : function () { return MyApplicationInstance.GameHeight(); },

    InvertYEnabled : function () { return false; }
}




// ****************************
// Application Touch and key board

function checkDown(e) 
{
    touchVar = e || window.event;
    //console.log("here1");
}

function checkUp(e)
{
    touchVar = undefined;
    //console.log("here2");
}

function OnKeyPress ( e) 
{
    if ( e == null || e == undefined )
        return;

    MyApplicationInstance.StateManager.OnKeyPress ( e.keyCode );
}

function OnMouseDown(evt) 
{
    var mousePos = GetMousePosFromCanvas( renderer.canvas, evt);

    if ( renderer.InvertYEnabled() )
    {
        mousePos.y = renderer.Height() - mousePos.y;
    }

    if ( MyApplicationInstance.StateManager != null )
        MyApplicationInstance.StateManager.OnMouseDown ( mousePos.x, mousePos.y );

    //console.log('OnMouseDown ' + mousePos.x + " " + mousePos.y );
}
function OnMouseUp(evt) 
{
    var mousePos = GetMousePosFromCanvas( renderer.canvas, evt);
    if ( renderer.InvertYEnabled() )
    {
        mousePos.y = renderer.Height() - mousePos.y;
    }

    if ( MyApplicationInstance.StateManager != null )
        MyApplicationInstance.StateManager.OnMouseUp ( mousePos.x, mousePos.y );

    //console.log('OnMouseUp ' + mousePos.x + " " + mousePos.y );
}

function GetMousePosFromCanvas(canvas, evt) 
{
    // var rect = canvas.getBoundingClientRect();
    // return {
    //     x: (event.clientX - rect.left)/scaleUp,
    //     y: (event.clientY - rect.top)/scaleUp
    // };

    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}


function OnPatternSelectionChanged()
{
    // This is crazy hack ... 
    MyApplicationInstance.StateManager.CurrentState().OnPatternSelected();
}


function OnSpeedSelectionChanged()
{
    // This is crazy hack ... 
    MyApplicationInstance.StateManager.CurrentState().OnSpeedChanged();
}


function OnZoomSelectionChanged()
{
    // This is crazy hack ... 
    MyApplicationInstance.StateManager.CurrentState().OnZoomChanged();
}

// Utility for ingame

function ConvertRowColToIndex ( r, c )
{
    return r * MAX_ROWS_COLS + c ;
}
function ConvertIndexToRow ( index )
{
    return Math.floor( index / MAX_ROWS_COLS );
}
function ConvertIndexToCol ( index )
{
    return index % MAX_ROWS_COLS;
}

