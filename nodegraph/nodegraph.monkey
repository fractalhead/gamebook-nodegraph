'Node Graph

Import mojo
Import monkey.math
Import vector

Global scale:Float = 0.4
Global offsetX:Float = 0
Global offsetY:Float = 0
Global lastMouseX:Float = 0
Global lastMouseY:Float = 0

Global go:Bool = false

Class Node
	Field index:Int
	Field linksFrom:Int[]
	Field linksTo:Int[]
	Field position:Vector
	Field velocity:Vector
	Field acceleration:Vector
	Field type:String
	
	Method New(_index:Int, _x:Float, _y:Float)
		index = _index
		position = New Vector(_x, _y)
		velocity = New Vector(0, 0)
		linksFrom = []
		linksTo = []
		type=""
	End
	
	Method addLinkFrom(_from:Int)
		linksFrom = linksFrom.Resize(linksFrom.Length+1)
		linksFrom[linksFrom.Length-1] = _from
	End
	
	Method addLinkTo(_to:Int)
		linksTo = linksTo.Resize(linksTo.Length+1)
		linksTo[linksTo.Length-1] = _to
	End
	
	Method setType(_type:String)
		type = _type
	End
	
	Method linkedTo:Bool(_to:Int)
		Local isLinked:Bool = False
		For Local i:Int = Eachin linksTo
     		If i = _to
     			isLinked = True
     			Exit
     		End
     	Next
     	If Not isLinked
     		For Local j:Int = Eachin linksFrom
     			If j = _to
     				isLinked = True
     				Exit
     			End
     		Next
     	End
     	Return isLinked
	End
	
	Method isMousedOver:Bool()
		Local px:Float = (position.X+offsetX)*scale
		Local mx1:Float = MouseX - (24 * scale)
		Local mx2:Float = MouseX + (24 * scale)
		If px >= mx1 And px <= mx2
			Local py:Float = (position.Y+offsetY)*scale
			Local my1:Float = MouseY - (24 * scale)
			Local my2:Float = MouseY + (24 * scale)
			If py >= my1 And py <= my2
				Return True
			End
		End
		Return False
	End
	
	Method tick()
		If velocity.Length > 40
			velocity.Length = 40
		end
		position.Add(velocity)
		'velocity.Set(0,0)
		velocity.Length = velocity.Length * 0.8
	End
	
	Method draw()
		If isMousedOver()
			SetColor(0,255,0)
			DrawCircle((position.X+offsetX)*scale, (position.Y+offsetY)*scale, 26*scale)
		End
		If type = "?"
			SetColor(0,255,255) 'items needed to progress somewhere
		Elseif linksTo.Length = 0 And linksFrom.Length = 0
			SetColor(0,0,255) 'picture page
		Elseif linksTo.Length = 0
			SetColor(255,0,0) 'died
		Elseif linksTo[0] = -1
			SetColor(255,255,0) 'good ending
		Elseif linksTo[0] = -2
			SetColor(255,180,0) 'blah ending
		Elseif type = "c"
			SetColor(255,0,255) 'combat
		Elseif index = 1 'Or (linksTo.Length > 0 And linksFrom.Length = 0)
			SetColor(0,255,0) 'start
		Elseif linksTo.Length > 0 And linksFrom.Length = 0
			SetColor(0,128,0) 'secret link to
		Else
			SetColor(255,255,255) 'normal
		End
		DrawCircle((position.X+offsetX)*scale, (position.Y+offsetY)*scale, 20*scale)
	End
	
	Method nodeType:String()
		If type = "?"
			Return " - Items Required" 'items needed to progress somewhere
		Elseif linksTo.Length = 0 And linksFrom.Length = 0
			Return " - Picture" 'picture page
		Elseif linksTo.Length = 0
			Return " - Bad Ending" 'died
		Elseif linksTo[0] = -1
			Return " - Good Ending" 'good ending
		Elseif linksTo[0] = -2
			Return " - Blah Ending" 'blah ending
		Elseif type = "c"
			Return " - Combat" 'combat
		Elseif index = 1 'Or (linksTo.Length > 0 And linksFrom.Length = 0)
			Return " - Start" 'start
		Elseif linksTo.Length > 0 And linksFrom.Length = 0
			Return " - Secretly Linked To" 'secret linked to
		Else
			Return "" 'normal
		End
	End
End

Class NodeGraph Extends App
    
    Field numPages:Int
    Field gameTitle:String
    Field nodes:Node[1000]
    
    Method CreateInit(num:Int, title:String)
    	SetUpdateRate 30
    	
    	numPages = num
        
    	gameTitle = title
    
        'create nodes
        Local wide:Float = Ceil(Sqrt(numPages))
        Local spacing:Float = 35
        For Local i:Int = 1 To numPages
     		nodes[i] = New Node(i, (-(spacing*wide/2.0) + ((i-1) Mod wide) * spacing), (-(spacing*wide/2.0) + Floor((i-1) / wide) * spacing))
     	Next
     	
  	  	offsetX += (DeviceWidth/2) / scale
        offsetY += (DeviceHeight/2) / scale
    End
    
    Method LinkNodes(n1:Int, n2:Int=0, n3:Int=0, n4:Int=0, n5:Int=0, n6:Int=0, n7:Int=0)
    	nodes[n1].addLinkTo(n2)
		If n2 > 0
			nodes[n2].addLinkFrom(n1)
		End
		If n3 > 0
			nodes[n1].addLinkTo(n3)
			nodes[n3].addLinkFrom(n1)
		End
		If n4 > 0
			nodes[n1].addLinkTo(n4)
			nodes[n4].addLinkFrom(n1)
		End
		If n5 > 0
			nodes[n1].addLinkTo(n5)
			nodes[n5].addLinkFrom(n1)
		End
		If n6 > 0
			nodes[n1].addLinkTo(n6)
			nodes[n6].addLinkFrom(n1)
		End
		If n7 > 0
			nodes[n1].addLinkTo(n7)
			nodes[n7].addLinkFrom(n1)
		End
    End
    
    Method LinkNodes(n1:Int, n2:Int=0, n3:Int=0, n4:Int=0, n5:Int=0, n6:Int=0, n7:Int=0, t1:String)
    	LinkNodes(n1,n2,n3,n4,n5,n6,n7)
    	NodeType(n1,t1)
    End
    
    Method LinkNodes(n1:Int, n2:Int=0, n3:Int=0, n4:Int=0, n5:Int=0, n6:Int=0, t1:String)
    	LinkNodes(n1,n2,n3,n4,n5,n6)
    	NodeType(n1,t1)
    End
    
    Method LinkNodes(n1:Int, n2:Int=0, n3:Int=0, n4:Int=0, n5:Int=0, t1:String)
    	LinkNodes(n1,n2,n3,n4,n5)
    	NodeType(n1,t1)
    End
    
    Method LinkNodes(n1:Int, n2:Int=0, n3:Int=0, n4:Int=0, t1:String)
    	LinkNodes(n1,n2,n3,n4)
    	NodeType(n1,t1)
    End
    
    Method LinkNodes(n1:Int, n2:Int=0, n3:Int=0, t1:String)
    	LinkNodes(n1,n2,n3)
    	NodeType(n1,t1)
    End
    
    Method LinkNodes(n1:Int, n2:Int=0, t1:String)
    	LinkNodes(n1,n2)
    	NodeType(n1,t1)
    End
    
    Method LinkNodes(n1:Int, t1:String)
    	NodeType(n1,t1)
    End
    
    Method NodeType(n:Int, type:String)
    	nodes[n].setType(type)
    End
    
    Method LinkNodes()
    	'null
    End

	Method OnUpdate()
        If MouseHit( MOUSE_LEFT )
        	offsetX -= ((MouseX-(DeviceWidth/2)) / scale)
        	offsetY -= ((MouseY-(DeviceHeight/2)) / scale)
        End
        If KeyHit(KEY_MINUS)
        	Local scalefactor:Float = 0.9
        	If KeyDown(KEY_SHIFT)
        		scalefactor = 0.6
        	End
        	Local offX:Float = ((DeviceWidth/2)/scale) - ((DeviceWidth/2)/(scale * scalefactor))
        	Local offY:Float = ((DeviceHeight/2)/scale) - ((DeviceHeight/2)/(scale * scalefactor))
        	offsetX -= offX
        	offsetY -= offY
        	scale = scale * scalefactor
        Elseif KeyHit(KEY_EQUALS)
        	Local scalefactor:Float = 0.9
        	If KeyDown(KEY_SHIFT)
        		scalefactor = 0.6
        	End
        	Local offX:Float = ((DeviceWidth/2)/(scale / scalefactor)) - ((DeviceWidth/2)/scale)
        	Local offY:Float = ((DeviceHeight/2)/(scale / scalefactor)) - ((DeviceHeight/2)/scale)
        	offsetX += offX
        	offsetY += offY
        	scale = scale / scalefactor
        Elseif KeyHit(KEY_UP)
        	For Local idx:Int = 1 To numPages
	     		Local node:Node = nodes[idx]
	     		If node.isMousedOver()
	     			node.position = New Vector(node.position.X, node.position.Y-200.0)
	     		End
			Next
		Elseif KeyHit(KEY_DOWN)
        	For Local idx:Int = 1 To numPages
	     		Local node:Node = nodes[idx]
	     		If node.isMousedOver()
	     			node.position = New Vector(node.position.X, node.position.Y+200.0)
	     		End
			Next
		Elseif KeyHit(KEY_RIGHT)
        	For Local idx:Int = 1 To numPages
	     		Local node:Node = nodes[idx]
	     		If node.isMousedOver()
	     			node.position = New Vector(node.position.X+200.0, node.position.Y)
	     		End
			Next
		Elseif KeyHit(KEY_LEFT)
        	For Local idx:Int = 1 To numPages
	     		Local node:Node = nodes[idx]
	     		If node.isMousedOver()
	     			node.position = New Vector(node.position.X-200.0, node.position.Y)
	     		End
			Next
		Elseif KeyHit(KEY_SPACE)
			go = Not go
        End
	End
	
	Method DrawThickLine( x1 : Float, y1 : Float, x2 : Float, y2 : Float, thickness : Float = 2.0 )
		Local dx : Float = x2 - x1
		Local dy : Float = y2 - y1
		Local d : Float = Sqrt( dx * dx + dy * dy )
		Local vx : Float = dx / d
		Local vy : Float = dy / d
		Local nx : Float = vy
		Local ny : Float = -vx
		Local points : Float[ 8 ]
		points[ 0 ] = x1 + ( nx * ( thickness / 2.0 ))
		points[ 1 ] = y1 + ( ny * ( thickness / 2.0 ))
		points[ 2 ] = x1 + ( -nx * ( thickness / 2.0 ))
		points[ 3 ] = y1 + ( -ny * ( thickness / 2.0 ))
		points[ 4 ] = x2 + ( -nx * ( thickness / 10.0 ))
		points[ 5 ] = y2 + ( -ny * ( thickness / 10.0 ))	
		points[ 6 ] = x2 + ( nx * ( thickness / 10.0 ))
		points[ 7 ] = y2 + ( ny * ( thickness / 10.0 ))
		DrawPoly( points )
	End

    Method OnRender()
        Cls
        
        'calculate forces
        If go
        For Local n1:Int = 1 To numPages-1
        	Local node1:Node = nodes[n1]
        	Local fv:Vector = New Vector(0,0)
        	
        	For Local n2:Int = n1+1 To numPages
        		Local node2:Node = nodes[n2]
        		
        		'get force vectors
        		Local dist:Float = node1.position.DistanceTo(node2.position)
        		If dist > 1
        			fv = node2.position.Copy()
        			fv = fv.Subtract(node1.position)
        			fv = fv.Normalize()
        			fv = fv.Multiply(-1) 'repulse
        			
        			If dist <= 100
        				fv = fv.Multiply((100/dist)*(100/dist)*(100/dist))
        			Else
        				If node2.linkedTo(n1)
    	    				fv = fv.Multiply(-1) 'attract
        					fv = fv.Multiply((dist/100)*(dist/100)*(dist/100))
        				Else
        					fv = fv.Multiply((250/dist)*(250/dist))
        				End
        			End
        			
        			'add vector to node1
        			node1.velocity.Add(fv)
        			'add vector to node2
        			fv = fv.Multiply(-1)
        			node2.velocity.Add(fv)
        		End
        	Next
        Next
        End
        
        'draw node links
        For Local idx:Int = 1 To numPages
     		Local node:Node = nodes[idx]
     		
     		If Not node.isMousedOver()	
     			SetColor(128,128,128)
     			Local ltarr:Int[] = node.linksTo
	     		For Local i:Int = Eachin ltarr
	     			If i > 0 And i <> idx
	     				Local toNode:Node = nodes[i]
	     				DrawThickLine((node.position.X+offsetX)*scale, (node.position.Y+offsetY)*scale, (toNode.position.X+offsetX)*scale, (toNode.position.Y+offsetY)*scale, 20.0*scale)
	     			End
	     		Next
     		End
		Next
		
		'draw active links on top
		For Local idx:Int = 1 To numPages
     		Local node:Node = nodes[idx]
     		
     		If node.isMousedOver()
     			SetColor(0,255,0)
				Local ltarr:Int[] = node.linksTo
     			For Local i:Int = Eachin ltarr
     				If i > 0 And i <> idx
     					Local toNode:Node = nodes[i]
     					DrawThickLine((node.position.X+offsetX)*scale, (node.position.Y+offsetY)*scale, (toNode.position.X+offsetX)*scale, (toNode.position.Y+offsetY)*scale, 20.0*scale)
     				End
     			Next
     		End
		Next
		
		Local page:String = ""
		
		'draw nodes
		For Local idx:Int = 1 To numPages
     		Local node:Node = nodes[idx]
     		node.draw()
     		If node.isMousedOver()
     			page = "Page " + node.index + node.nodeType()
     		End
     		node.tick()
		Next
		
		SetColor(255,255,255)
		DrawText gameTitle,DeviceWidth/2,2,0.5
		DrawText page,DeviceWidth/2,18,0.5
		If Not go
			DrawText "Space to Play/Pause, +/- to Zoom, Click to Center", DeviceWidth/2, DeviceHeight-14, 0.5
		End
		'DrawText "MouseX="+MouseX+", MouseY="+MouseY,0,0
		
    End
    
End