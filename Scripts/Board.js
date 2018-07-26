



function Board( )
{
    this.map = null;
    this.blockWidth = 10;
    this.blockGap = 0;
    this.blockScale = 1;
    this.notAliveColor = "#ffffff";     // these will be set dynamically
    this.previouslyAliveColor = "#ffffff";   // these will be set dynamically
    this.aliveColor = "#ffffff";   // these will be set dynamically
    this.backGroundColor = "#ffffff"  // these will be set dynamically
    this.useTracks = false;
    this.simulationFrameCount = 0;
    this.totalAliveCount = 0;
    this.totalGenerationCount = 0;
    this.totalDeathCount = 0;
    this.currentPattern = null;
    this.mousePosition = null;
    this.previousToggledBlockX = -1;
    this.previousToggledBlockY = -1;
    this.originOffset = null;
    

    this.Init = function( boardSizeX, boardSizeY )
    {
        this.map = new CoordinateMap();
        this.map.Init ( boardSizeX, boardSizeY, BoardBlock );
    }

    this.SetRenderColors = function( backgroundColor, notAliveColor, previouslyAliveColor, aliveColor )
    {
        this.backGroundColor = backgroundColor;
        this.notAliveColor = notAliveColor;
        this.previouslyAliveColor = previouslyAliveColor;
        this.aliveColor = aliveColor;
    }

    this.DrawDefaultPattern = function ( patternObj, x, y  )
    {
        if ( patternObj.base != null && patternObj.base.aliveTiles != null )
        {
            for ( let patternCount = 0; patternCount < patternObj.base.aliveTiles.length; patternCount ++ )
            {
                let offset = patternObj.base.aliveTiles[patternCount];
                this.currentBlock = this.map.GetMeDataAt ( x + offset.x , y + offset.y);
                this.currentBlock.MakeMeAliveInstantly ( offset.alive );
            }
        }

    }

    this.Reset = function () 
    {
        this.simulationFrameCount = 0;
        for ( let y = this.map.minYInclusive; y <= this.map.maxYInclusive; y ++ ) 
        {
            for ( let x = this.map.minXInclusive; x <= this.map.maxXInclusive; x++ )
            {
                this.currentBlock = this.map.GetMeDataAt ( x, y );
                this.currentBlock.Reset();
            }
        }
    }
    this.SetBlockSize = function ( x )
    {
        this.blockWidth = x;
        this.blockGap = this.blockWidth * this.blockScale/10;
        
    }
    this.SetBlockGap = function ( x )
    {
        this.blockScale = x;
        this.blockGap = this.blockWidth * this.blockScale/10;
        console.log("block gap:" + this.blockGap);
    }

    this.GetRowSize = function ()
    {
        return this.map.totalX;
    }
    this.GetColSize = function ()
    {
        return this.map.totalY;
    }
    this.SetPattern = function ( pattern )
    {
        this.currentPattern = pattern;
    }
    this.SetOriginOffset = function ( x, y )
    {
        this.originOffset = { "x":x, "y":y };
    }
    this.ForceMakeAlive = function ( x, y, alive )
    {
        boardblock = this.map.GetMeDataAt(x, y);
        if ( boardblock != null )
        {
            boardblock.MakeMeAliveNextFrame ( alive );
            boardblock.SwapFrames ();
        }
        else 
            alert ( "ERROR?" );
    }
    this.GetDataForExport = function ( startX, startY, endX, endY, wrtX, wrtY )
    {
        alert( "from (" + startX + "," + startY + ") " + "to (" +  endX + "," + endY + ") ");

        var dataForExport = [];
        for ( let y = startY; y <= endY; y ++ ) 
        {
            for ( let x = startX; x <= endX; x++ )
            {
                this.currentBlock = this.map.GetMeDataAt ( x, y );
                
                if ( this.currentBlock != null && this.currentBlock.isAlive)
                {
                    dataForExport.push ( 
                        {
                            "x": this.currentBlock.x - wrtX,
                            "y":(this.currentBlock.y - wrtY) - ( endY - startY ),
                            "alive": this.currentBlock.isAlive
                        }
                    );
                }
            }
        }
        return dataForExport;
    }

    this.ClearDataWithInBounds = function ( startX, startY, endX, endY )
    {
        alert( "from (" + startX + "," + startY + ") " + "to (" +  endX + "," + endY + ") ");

        var dataForExport = [];
        for ( let y = startY; y <= endY; y ++ ) 
        {
            for ( let x = startX; x <= endX; x++ )
            {
                this.currentBlock = this.map.GetMeDataAt ( x, y );
                
                if ( this.currentBlock != null && this.currentBlock.isAlive)
                {
                    this.currentBlock.MakeMeAliveInstantly( false );
                }
            }
        }
        return dataForExport;
    }

    this.SimulateNextFrame = function ()
    {
        this.simulationFrameCount ++;
        this.totalAliveCount = 0;
        this.totalGenerationCount = 0;
        this.totalDeathCount = 0;

        for ( let y = this.map.minYInclusive; y <= this.map.maxYInclusive; y ++ ) 
        {
            for ( let x = this.map.minXInclusive; x <= this.map.maxXInclusive; x++ )
            {
                this.currentBlock = this.map.GetMeDataAt ( x, y );
                
                this.tempAliveCount = 0;
                for ( let yNeighbour = - 1; yNeighbour <= +1; yNeighbour++ )
                {
                    for ( let xNeighbour = - 1; xNeighbour <= +1; xNeighbour++ )
                    {
                        if ( xNeighbour == 0 && yNeighbour == 0 )
                            continue;

                        this.tempBlock = this.map.GetMeDataAt ( x + xNeighbour, y + yNeighbour );
                        if ( this.tempBlock != null )
                        {
                            if( this.tempBlock.isAlive )
                                this.tempAliveCount ++;
                        }
                    }
                }

                if ( this.currentBlock.isAlive )
                {
                    if ( this.tempAliveCount < 2 )
                    {
                        this.currentBlock.MakeMeAliveNextFrame ( false );   // dies due to underpopulation
                    }
                    else if ( this.tempAliveCount > 3)
                    {
                        this.currentBlock.MakeMeAliveNextFrame ( false ); // dies due to overpopulation
                    }
                    else 
                    {
                        // continues to live 
                    }
                }
                else 
                {
                    if ( this.tempAliveCount == 3 )
                    {
                        this.currentBlock.MakeMeAliveNextFrame ( true );
                    }
                }
                
                if ( this.currentBlock.IsAliveNextFrame() )
                {
                    this.totalAliveCount ++;
                }
                if ( this.currentBlock.IsGoingToBeBormNextFrame() )
                {
                    this.totalGenerationCount ++;
                }
                if ( this.currentBlock.IsGoingToDieNextFrame() )
                {
                    this.totalDeathCount++;
                }
            }
        }   
    }

    this.SwapWithNextFrame = function ()
    {
        for ( let y = this.map.minYInclusive; y <= this.map.maxYInclusive; y ++ ) 
        {
            for ( let x = this.map.minXInclusive; x <= this.map.maxXInclusive; x++ )
            {
                this.currentBlock = this.map.GetMeDataAt ( x, y );
                this.currentBlock.SwapFrames();
            }
        }
    }

    this.Render = function ( renderer ) 
    {
        if ( this.map == null )
            return;

        let startX = ( MyApplicationInstance.GameWidth() / 2 ) - ( ( this.map.totalX * ( this.blockWidth + this.blockGap ) + this.blockGap )/ 2 );
        let startY = ( MyApplicationInstance.GameHeight() / 2 ) + ( ( this.map.totalY * ( this.blockWidth + this.blockGap ) + this.blockGap )/ 2 );

        if ( this.originOffset != null )
        {
            startX += ( this.blockWidth + this.blockGap ) * this.originOffset.x;
            startY += ( this.blockWidth + this.blockGap ) * (-this.originOffset.y);
        }

        let currentX;
        let currentY;

        currentY = startY - this.blockGap /* we are moving above, the last boarder */
             - this.blockWidth /* this is because, every block-box is not rendered from the center, but from top left. so to make it evenr */;

        // background rendering
        renderer.context.fillStyle = this.backGroundColor;
        renderer.context.fillRect( 0, 0,MyApplicationInstance.GameWidth() , MyApplicationInstance.GameHeight() );

        // blocks rendering
        for ( let y = this.map.minYInclusive; y <= this.map.maxYInclusive; y ++ ) 
        {
            currentX = startX + this.blockGap;
            for ( let x = this.map.minXInclusive; x <= this.map.maxXInclusive; x++ )
            {
                this.currentBlock = this.map.GetMeDataAt ( x, y );
                
                if ( this.currentBlock == null )
                    renderer.context.fillStyle = "red";
                else 
                {
                    if ( this.currentBlock.x != x || this.currentBlock.y != y )
                    {
                        alert ( "ERROR with co-ordinates ");
                    }

                    if ( this.currentBlock.isAlive )
                        renderer.context.fillStyle = this.aliveColor;
                    else if ( this.currentBlock.haveIBeenAlive )
                    {
                        if ( this.useTracks )
                            renderer.context.fillStyle = this.previouslyAliveColor;
                        else 
                            renderer.context.fillStyle = this.notAliveColor;
                    }
                    else
                        renderer.context.fillStyle = this.notAliveColor;
                }

                this.currentBlock.SetCoordinates ( currentX , currentY, currentX + this.blockWidth, currentY + this.blockWidth );

                renderer.context.fillRect( currentX, currentY, this.blockWidth, this.blockWidth);

                currentX += this.blockWidth + this.blockGap;
            }
            currentY -= this.blockWidth + this.blockGap;
        }

        if ( this.enableDebugBlock && this.debugBlock )
        {
            renderer.context.fillStyle = "#FF0000AA";
            renderer.context.fillRect( this.debugBlock.x1, this.debugBlock.y1,
                 this.debugBlock.x2 - this.debugBlock.x1, this.debugBlock.y2 - this.debugBlock.y1);
        }
    }

    this.OnMouseDown = function( touchX, touchY )
    {

    }

    this.OnMouseMove = function ( touchX, touchY, isMousePressed )
    {
        if ( isMousePressed && this.currentBlock != null )
            this.ToggleBlock(touchX, touchY);
    }

    this.OnMouseUp = function( touchX, touchY )
    {
        this.ToggleBlock(touchX, touchY);
        this.MarkThisBlockAsPreviouslyToggled( null ); //on finger lift, clear previous toggle history
    }


    this.ToggleBlock = function ( touchX, touchY )
    {
        this.previousToggledBlockX = touchX;
        this.previousToggledBlockY = touchY;



        for ( let y = this.map.minYInclusive; y <= this.map.maxYInclusive; y ++ ) 
        {
            for ( let x = this.map.minXInclusive; x <= this.map.maxXInclusive; x++ )
            {
                this.currentBlock = this.map.GetMeDataAt ( x, y );

                if ( this.currentBlock == null )
                    continue;

                if ( touchX >= this.currentBlock.x1 && touchX <= this.currentBlock.x2 )
                {
                    if ( touchY >= this.currentBlock.y1 && touchY <= this.currentBlock.y2 )
                    {
                        this.mousePosition = { "x":x, "y":y };

                        // if this is already previously toggled in this mouse press session, ignore it for now.
                        if ( !this.CanIToggleThisBlock ( this.currentBlock ))
                        {
                            return;
                        }

                        this.MarkThisBlockAsPreviouslyToggled ( this.currentBlock );
                        if ( this.currentPattern == null )
                        {
                            this.currentBlock.MakeMeAliveInstantly ( !this.currentBlock.isAlive );
                            if ( this.enableDebugBlock )
                            {
                                console.log("Block selected: (" + this.currentBlock.x + "," + this.currentBlock.y + ")" );
                                this.debugBlock = { x1:this.currentBlock.x1,x2:this.currentBlock.x2,y1:this.currentBlock.y1,y2:this.currentBlock.y2, };
                            }
                        }
                        else 
                        {
                            if ( this.currentPattern.base != null && this.currentPattern.base.aliveTiles != null )
                            {
                                for ( let patternCount = 0; patternCount < this.currentPattern.base.aliveTiles.length; patternCount ++ )
                                {
                                    let offset = this.currentPattern.base.aliveTiles[patternCount];
                                    this.currentBlock = this.map.GetMeDataAt ( x + offset.x , y + offset.y);
                                    this.currentBlock.MakeMeAliveInstantly ( offset.alive );
                                }
                            }
                        }
                        return;
                    }
                }
            }
        }
    }


    this.CanIToggleThisBlock = function ( block )
    {
        if ( block == this.previousToggledBlock && this.previousToggledBlock != null )
        {
            return false;;
        }
        
        return true;
    }
    this.MarkThisBlockAsPreviouslyToggled = function( block )
    {
        this.previousToggledBlock = block;
    }

    this.previousToggledBlock = null;
    this.currentBlock = null;
    this.debugBlock = null;
    this.tempAliveCount = 0;
    this.enableDebugBlock = false;
    this.tempBlock = null;
}

function CoordinateMap ()
{
    this.totalX = 0;
    this.totalY = 0;

    this.centerIndexX = 0;
    this.centerIndexY = 0;

    this.minXInclusive = 0;
    this.maxXInclusive = 0;
    this.minYInclusive = 0;
    this.maxYInclusive = 0;

    // this.totalXInOneDirection;
    // this.totalYInOneDirection;

    this.userObject = null;

    this.allUserData = null;

    this.Init = function ( maxX, maxY, userObjectType )
    {
        this.totalX = maxX * 2 + 1; // Example . if you want to find columns between X = -2 to X = 2 , it is -2,-1,0,1,2 . thats X * 2 + 1 ( origin )
        this.totalY = maxY * 2 + 1;

        this.minXInclusive = -maxX;
        this.maxXInclusive = maxX;

        this.minYInclusive = -maxY;
        this.maxYInclusive = maxY;

        this.centerIndexX = maxX;       // since 0th is -2 , 1th is -1 and 2nd is "0" origin. So u need data on origin ( 0,0) access centerIndexX,centerIndexY data. 
        this.centerIndexY = maxY;       // since 0th is -2 , 1th is -1 and 2nd is "0" origin. So u need data on origin ( 0,0) access centerIndexX,centerIndexY data. 

        this.userObject = userObjectType;

        this.allUserData = [];
        for ( y = 0; y < this.totalY; y ++ )
        {
            this.allUserData.push( [] );
            for ( x = 0; x < this.totalX; x++ )
            {
                this.allUserData[y].push ( new this.userObject() );
            }
        }

        for ( y = this.minYInclusive; y <= this.maxYInclusive; y ++ )
        {
            for ( x = this.minXInclusive; x <= this.maxXInclusive; x++ )
            {
                boardBlock = this.GetMeDataAt ( x, y);
                boardBlock.Init ( x, y );
            }
        }
    }

    // this.GetMeIndexedDataAt = function ( x, y )
    // {
    //     if ( x < 0 || x >= this.totalX )
    //         return null;
    //     if ( y < 0 || y >= this.totalY )
    //         return null;

    //     return this.allUserData[y][x];
    // }
    this.GetMeDataAt = function ( x, y )
    {
        x = x + this.centerIndexX;
        y = y + this.centerIndexY;

        if ( x < 0 || x >= this.totalX )
            return null;
        if ( y < 0 || y >= this.totalY )
            return null;

        return this.allUserData[y][x];
    }
}

function BoardBlock ()
{
    this.x = 0;
    this.y = 0;

    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;

    this.Init = function ( x, y )
    {
        this.x = x; 
        this.y = y;
    }
    this.SetCoordinates  = function ( x1, y1, x2, y2 )
    {
        this.x1 = x1; 
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    this.isAlive = false;   // conway's algorithm value
    this.amIAliveInNextCycle = false;

    this.haveIBeenAlive = false;

    // this is for non simulation time 
    this.MakeMeAliveInstantly = function ( alive )
    {
        this.isAlive = alive;
        this.amIAliveInNextCycle = alive;
    }
    this.MakeMeAliveNextFrame = function ( alive )
    {
        this.amIAliveInNextCycle = alive;
    }
    this.SwapFrames = function ( )
    {
        if ( this.amIAliveInNextCycle || this.isAlive )
            this.haveIBeenAlive = true;
        
        this.isAlive = this.amIAliveInNextCycle;
    }

    this.IsAliveNextFrame = function () 
    {
        return this.amIAliveInNextCycle;
    }
    this.IsGoingToDieNextFrame = function () 
    {
        return this.amIAliveInNextCycle == false && this.isAlive == true;
    }
    this.IsGoingToBeBormNextFrame = function () 
    {
        return this.amIAliveInNextCycle == true && this.isAlive == false;
    }

    this.Reset = function ()
    {
        this.isAlive = false;   
        this.amIAliveInNextCycle = false;

        this.haveIBeenAlive = false;
    }
}
