
//Change this to true for a stretchy canvas!
//
var RESIZEABLE_CANVAS=false;

//Start us up!
//
window.onload=function( e ){

	if( RESIZEABLE_CANVAS ){
		window.onresize=function( e ){
			var canvas=document.getElementById( "GameCanvas" );

			//This vs window.innerWidth, which apparently doesn't account for scrollbar?
			var width=document.body.clientWidth;
			
			//This vs document.body.clientHeight, which does weird things - document seems to 'grow'...perhaps canvas resize pushing page down?
			var height=window.innerHeight;			

			canvas.width=width;
			canvas.height=height;
		}
		window.onresize( null );
	}

	BBMonkeyGame.Main( document.getElementById( "GameCanvas" ) );
}

//${CONFIG_BEGIN}
CFG_BINARY_FILES="*.bin|*.dat";
CFG_BRL_GAMETARGET_IMPLEMENTED="1";
CFG_BRL_THREAD_IMPLEMENTED="1";
CFG_CONFIG="release";
CFG_HOST="winnt";
CFG_IMAGE_FILES="*.png|*.jpg";
CFG_LANG="js";
CFG_MOJO_AUTO_SUSPEND_ENABLED="1";
CFG_MOJO_DRIVER_IMPLEMENTED="1";
CFG_MUSIC_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_OPENGL_GLES20_ENABLED="0";
CFG_SAFEMODE="0";
CFG_SOUND_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_TARGET="html5";
CFG_TEXT_FILES="*.txt|*.xml|*.json";
//${CONFIG_END}

//${METADATA_BEGIN}
var META_DATA="[mojo_font.png];type=image/png;width=864;height=13;\n";
//${METADATA_END}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

var err_info="";
var err_stack=[];

var dbg_index=0;

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	if( !err_info.length ) return "";
	var str=err_info+"\n";
	for( var i=err_stack.length-1;i>0;--i ){
		str+=err_stack[i]+"\n";
	}
	return str;
}

function print( str ){
	var cons=document.getElementById( "GameConsole" );
	if( cons ){
		cons.value+=str+"\n";
		cons.scrollTop=cons.scrollHeight-cons.clientHeight;
	}else if( window.console!=undefined ){
		window.console.log( str );
	}
	return 0;
}

function alertError( err ){
	if( typeof(err)=="string" && err=="" ) return;
	alert( "Monkey Runtime Error : "+err.toString()+"\n\n"+stackTrace() );
}

function error( err ){
	throw err;
}

function debugLog( str ){
	if( window.console!=undefined ) window.console.log( str );
}

function debugStop(){
	debugger;	//	error( "STOP" );
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_charCodeAt( str,index ){
	if( index<0 || index>=str.length ) error( "Character index out of range" );
	return str.charCodeAt( index );
}

function dbg_array( arr,index ){
	if( index<0 || index>=arr.length ) error( "Array index out of range" );
	dbg_index=index;
	return arr;
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_compare( lhs,rhs ){
	var n=Math.min( lhs.length,rhs.length ),i,t;
	for( i=0;i<n;++i ){
		t=lhs.charCodeAt(i)-rhs.charCodeAt(i);
		if( t ) return t;
	}
	return lhs.length-rhs.length;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_startswith( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_endswith( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function string_tochars( str ){
	var arr=new Array( str.length );
	for( var i=0;i<str.length;++i ) arr[i]=str.charCodeAt(i);
	return arr;
}

function string_fromchars( chars ){
	var str="",i;
	for( i=0;i<chars.length;++i ){
		str+=String.fromCharCode( chars[i] );
	}
	return str;
}

function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function object_implements( obj,iface ){
	if( obj && obj.implments && obj.implments[iface] ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}

function ThrowableObject(){
}

ThrowableObject.prototype.toString=function(){ 
	return "Uncaught Monkey Exception"; 
}


function BBGameEvent(){}
BBGameEvent.KeyDown=1;
BBGameEvent.KeyUp=2;
BBGameEvent.KeyChar=3;
BBGameEvent.MouseDown=4;
BBGameEvent.MouseUp=5;
BBGameEvent.MouseMove=6;
BBGameEvent.TouchDown=7;
BBGameEvent.TouchUp=8;
BBGameEvent.TouchMove=9;
BBGameEvent.MotionAccel=10;

function BBGameDelegate(){}
BBGameDelegate.prototype.StartGame=function(){}
BBGameDelegate.prototype.SuspendGame=function(){}
BBGameDelegate.prototype.ResumeGame=function(){}
BBGameDelegate.prototype.UpdateGame=function(){}
BBGameDelegate.prototype.RenderGame=function(){}
BBGameDelegate.prototype.KeyEvent=function( ev,data ){}
BBGameDelegate.prototype.MouseEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.TouchEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.MotionEvent=function( ev,data,x,y,z ){}
BBGameDelegate.prototype.DiscardGraphics=function(){}

function BBGame(){
	BBGame._game=this;
	this._delegate=null;
	this._keyboardEnabled=false;
	this._updateRate=0;
	this._started=false;
	this._suspended=false;
	this._debugExs=(CFG_CONFIG=="debug");
	this._startms=Date.now();
}

BBGame.Game=function(){
	return BBGame._game;
}

BBGame.prototype.SetDelegate=function( delegate ){
	this._delegate=delegate;
}

BBGame.prototype.Delegate=function(){
	return this._delegate;
}

BBGame.prototype.SetUpdateRate=function( updateRate ){
	this._updateRate=updateRate;
}

BBGame.prototype.SetKeyboardEnabled=function( keyboardEnabled ){
	this._keyboardEnabled=keyboardEnabled;
}

BBGame.prototype.Started=function(){
	return this._started;
}

BBGame.prototype.Suspended=function(){
	return this._suspended;
}

BBGame.prototype.Millisecs=function(){
	return Date.now()-this._startms;
}

BBGame.prototype.GetDate=function( date ){
	var n=date.length;
	if( n>0 ){
		var t=new Date();
		date[0]=t.getFullYear();
		if( n>1 ){
			date[1]=t.getMonth()+1;
			if( n>2 ){
				date[2]=t.getDate();
				if( n>3 ){
					date[3]=t.getHours();
					if( n>4 ){
						date[4]=t.getMinutes();
						if( n>5 ){
							date[5]=t.getSeconds();
							if( n>6 ){
								date[6]=t.getMilliseconds();
							}
						}
					}
				}
			}
		}
	}
}

BBGame.prototype.SaveState=function( state ){
	localStorage.setItem( "monkeystate@"+document.URL,state );	//key can't start with dot in Chrome!
	return 1;
}

BBGame.prototype.LoadState=function(){
	var state=localStorage.getItem( "monkeystate@"+document.URL );
	if( state ) return state;
	return "";
}

BBGame.prototype.LoadString=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );
	
	xhr.send( null );
	
	if( xhr.status==200 || xhr.status==0 ) return xhr.responseText;
	
	return "";
}

BBGame.prototype.PollJoystick=function( port,joyx,joyy,joyz,buttons ){
	return false;
}

BBGame.prototype.OpenUrl=function( url ){
	window.location=url;
}

BBGame.prototype.SetMouseVisible=function( visible ){
	if( visible ){
		this._canvas.style.cursor='default';	
	}else{
		this._canvas.style.cursor="url('data:image/cur;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA55ZXBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOeWVxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnllcGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////////////////////+////////f/////////8%3D'), auto";
	}
}

BBGame.prototype.PathToFilePath=function( path ){
	return "";
}

//***** js Game *****

BBGame.prototype.PathToUrl=function( path ){
	return path;
}

BBGame.prototype.LoadData=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );

	if( xhr.overrideMimeType ) xhr.overrideMimeType( "text/plain; charset=x-user-defined" );

	xhr.send( null );
	if( xhr.status!=200 && xhr.status!=0 ) return null;

	var r=xhr.responseText;
	var buf=new ArrayBuffer( r.length );
	var bytes=new Int8Array( buf );
	for( var i=0;i<r.length;++i ){
		bytes[i]=r.charCodeAt( i );
	}
	return buf;
}

//***** INTERNAL ******

BBGame.prototype.Die=function( ex ){

	this._delegate=new BBGameDelegate();
	
	if( !ex.toString() ){
		return;
	}
	
	if( this._debugExs ){
		print( "Monkey Runtime Error : "+ex.toString() );
		print( stackTrace() );
	}
	
	throw ex;
}

BBGame.prototype.StartGame=function(){

	if( this._started ) return;
	this._started=true;
	
	if( this._debugExs ){
		try{
			this._delegate.StartGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.StartGame();
	}
}

BBGame.prototype.SuspendGame=function(){

	if( !this._started || this._suspended ) return;
	this._suspended=true;
	
	if( this._debugExs ){
		try{
			this._delegate.SuspendGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.SuspendGame();
	}
}

BBGame.prototype.ResumeGame=function(){

	if( !this._started || !this._suspended ) return;
	this._suspended=false;
	
	if( this._debugExs ){
		try{
			this._delegate.ResumeGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.ResumeGame();
	}
}

BBGame.prototype.UpdateGame=function(){

	if( !this._started || this._suspended ) return;

	if( this._debugExs ){
		try{
			this._delegate.UpdateGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.UpdateGame();
	}
}

BBGame.prototype.RenderGame=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.RenderGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.RenderGame();
	}
}

BBGame.prototype.KeyEvent=function( ev,data ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.KeyEvent( ev,data );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.KeyEvent( ev,data );
	}
}

BBGame.prototype.MouseEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MouseEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MouseEvent( ev,data,x,y );
	}
}

BBGame.prototype.TouchEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.TouchEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.TouchEvent( ev,data,x,y );
	}
}

BBGame.prototype.MotionEvent=function( ev,data,x,y,z ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MotionEvent( ev,data,x,y,z );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MotionEvent( ev,data,x,y,z );
	}
}

BBGame.prototype.DiscardGraphics=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.DiscardGraphics();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.DiscardGraphics();
	}
}


function BBHtml5Game( canvas ){
	BBGame.call( this );
	BBHtml5Game._game=this;
	this._canvas=canvas;
	this._loading=0;
	this._timerSeq=0;
	this._gl=null;
	if( CFG_OPENGL_GLES20_ENABLED=="1" ){
		this._gl=this._canvas.getContext( "webgl" );
		if( !this._gl ) this._gl=this._canvas.getContext( "experimental-webgl" );
		if( !this._gl ) this.Die( "Can't create WebGL" );
		gl=this._gl;
	}
}

BBHtml5Game.prototype=extend_class( BBGame );

BBHtml5Game.Html5Game=function(){
	return BBHtml5Game._game;
}

BBHtml5Game.prototype.ValidateUpdateTimer=function(){

	++this._timerSeq;

	if( !this._updateRate || this._suspended ) return;
	
	var game=this;
	var updatePeriod=1000.0/this._updateRate;
	var nextUpdate=Date.now()+updatePeriod;
	var seq=game._timerSeq;
	
	function timeElapsed(){
		if( seq!=game._timerSeq ) return;

		var time;		
		var updates;
		
		for( updates=0;updates<4;++updates ){
		
			nextUpdate+=updatePeriod;
			
			game.UpdateGame();
			if( seq!=game._timerSeq ) return;
			
			if( nextUpdate-Date.now()>0 ) break;
		}
		
		game.RenderGame();
		if( seq!=game._timerSeq ) return;
		
		if( updates==4 ){
			nextUpdate=Date.now();
			setTimeout( timeElapsed,0 );
		}else{
			var delay=nextUpdate-Date.now();
			setTimeout( timeElapsed,delay>0 ? delay : 0 );
		}
	}

	setTimeout( timeElapsed,updatePeriod );
}

//***** BBGame methods *****

BBHtml5Game.prototype.SetUpdateRate=function( updateRate ){

	BBGame.prototype.SetUpdateRate.call( this,updateRate );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.GetMetaData=function( path,key ){
	if( path.indexOf( "monkey://data/" )!=0 ) return "";
	path=path.slice(14);

	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

BBHtml5Game.prototype.PathToUrl=function( path ){
	if( path.indexOf( "monkey:" )!=0 ){
		return path;
	}else if( path.indexOf( "monkey://data/" )==0 ) {
		return "data/"+path.slice( 14 );
	}
	return "";
}

BBHtml5Game.prototype.GetLoading=function(){
	return this._loading;
}

BBHtml5Game.prototype.IncLoading=function(){
	++this._loading;
	return this._loading;
}

BBHtml5Game.prototype.DecLoading=function(){
	--this._loading;
	return this._loading;
}

BBHtml5Game.prototype.GetCanvas=function(){
	return this._canvas;
}

BBHtml5Game.prototype.GetWebGL=function(){
	return this._gl;
}

//***** INTERNAL *****

BBHtml5Game.prototype.UpdateGame=function(){

	if( !this._loading ) BBGame.prototype.UpdateGame.call( this );
}

BBHtml5Game.prototype.SuspendGame=function(){

	BBGame.prototype.SuspendGame.call( this );
	
	BBGame.prototype.RenderGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.ResumeGame=function(){

	BBGame.prototype.ResumeGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.Run=function(){

	var game=this;
	var canvas=game._canvas;
	
	var touchIds=new Array( 32 );
	for( i=0;i<32;++i ) touchIds[i]=-1;
	
	function eatEvent( e ){
		if( e.stopPropagation ){
			e.stopPropagation();
			e.preventDefault();
		}else{
			e.cancelBubble=true;
			e.returnValue=false;
		}
	}
	
	function keyToChar( key ){
		switch( key ){
		case 8:case 9:case 13:case 27:case 32:return key;
		case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:case 45:return key|0x10000;
		case 46:return 127;
		}
		return 0;
	}
	
	function mouseX( e ){
		var x=e.clientX+document.body.scrollLeft;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}
	
	function mouseY( e ){
		var y=e.clientY+document.body.scrollTop;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}

	function touchX( touch ){
		var x=touch.pageX;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}			
	
	function touchY( touch ){
		var y=touch.pageY;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}
	
	canvas.onkeydown=function( e ){
		game.KeyEvent( BBGameEvent.KeyDown,e.keyCode );
		var chr=keyToChar( e.keyCode );
		if( chr ) game.KeyEvent( BBGameEvent.KeyChar,chr );
		if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<122) ) eatEvent( e );
	}

	canvas.onkeyup=function( e ){
		game.KeyEvent( BBGameEvent.KeyUp,e.keyCode );
	}

	canvas.onkeypress=function( e ){
		if( e.charCode ){
			game.KeyEvent( BBGameEvent.KeyChar,e.charCode );
		}else if( e.which ){
			game.KeyEvent( BBGameEvent.KeyChar,e.which );
		}
	}

	canvas.onmousedown=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseDown,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseDown,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseDown,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmouseup=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmousemove=function( e ){
		game.MouseEvent( BBGameEvent.MouseMove,-1,mouseX(e),mouseY(e) );
		eatEvent( e );
	}

	canvas.onmouseout=function( e ){
		game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );
		eatEvent( e );
	}
	
	canvas.onclick=function( e ){
		if( game.Suspended() ){
			canvas.focus();
		}
		eatEvent( e );
		return;
	}
	
	canvas.oncontextmenu=function( e ){
		return false;
	}
	
	canvas.ontouchstart=function( e ){
		if( game.Suspended() ){
			canvas.focus();
		}
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=-1 ) continue;
				touchIds[j]=touch.identifier;
				game.TouchEvent( BBGameEvent.TouchDown,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchmove=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				game.TouchEvent( BBGameEvent.TouchMove,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchend=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				touchIds[j]=-1;
				game.TouchEvent( BBGameEvent.TouchUp,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	window.ondevicemotion=function( e ){
		var tx=e.accelerationIncludingGravity.x/9.81;
		var ty=e.accelerationIncludingGravity.y/9.81;
		var tz=e.accelerationIncludingGravity.z/9.81;
		var x,y;
		switch( window.orientation ){
		case   0:x=+tx;y=-ty;break;
		case 180:x=-tx;y=+ty;break;
		case  90:x=-ty;y=-tx;break;
		case -90:x=+ty;y=+tx;break;
		}
		game.MotionEvent( BBGameEvent.MotionAccel,0,x,y,tz );
		eatEvent( e );
	}

	canvas.onfocus=function( e ){
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.ResumeGame();
		}
	}
	
	canvas.onblur=function( e ){
		for( var i=0;i<256;++i ) game.KeyEvent( BBGameEvent.KeyUp,i );
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.SuspendGame();
		}
	}
	
	canvas.focus();
	
	game.StartGame();

	game.RenderGame();
}


function BBMonkeyGame( canvas ){
	BBHtml5Game.call( this,canvas );
}

BBMonkeyGame.prototype=extend_class( BBHtml5Game );

BBMonkeyGame.Main=function( canvas ){

	var game=new BBMonkeyGame( canvas );

	try{

		bbInit();
		bbMain();

	}catch( ex ){
	
		game.Die( ex );
		return;
	}

	if( !game.Delegate() ) return;
	
	game.Run();
}


// HTML5 mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.

//***** gxtkGraphics class *****

function gxtkGraphics(){
	this.game=BBHtml5Game.Html5Game();
	this.canvas=this.game.GetCanvas()
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	this.gl=null;
	this.gc=this.canvas.getContext( '2d' );
	this.tmpCanvas=null;
	this.r=255;
	this.b=255;
	this.g=255;
	this.white=true;
	this.color="rgb(255,255,255)"
	this.alpha=1;
	this.blend="source-over";
	this.ix=1;this.iy=0;
	this.jx=0;this.jy=1;
	this.tx=0;this.ty=0;
	this.tformed=false;
	this.scissorX=0;
	this.scissorY=0;
	this.scissorWidth=0;
	this.scissorHeight=0;
	this.clipped=false;
}

gxtkGraphics.prototype.BeginRender=function(){
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	if( !this.gc ) return 0;
	this.gc.save();
	if( this.game.GetLoading() ) return 2;
	return 1;
}

gxtkGraphics.prototype.EndRender=function(){
	if( this.gc ) this.gc.restore();
}

gxtkGraphics.prototype.Width=function(){
	return this.width;
}

gxtkGraphics.prototype.Height=function(){
	return this.height;
}

gxtkGraphics.prototype.LoadSurface=function( path ){
	var game=this.game;

	var ty=game.GetMetaData( path,"type" );
	if( ty.indexOf( "image/" )!=0 ) return null;
	
	function onloadfun(){
		game.DecLoading();
	}
	
	game.IncLoading();

	var image=new Image();
	image.onload=onloadfun;
	image.meta_width=parseInt( game.GetMetaData( path,"width" ) );
	image.meta_height=parseInt( game.GetMetaData( path,"height" ) );
	image.src=game.PathToUrl( path );

	return new gxtkSurface( image,this );
}

gxtkGraphics.prototype.CreateSurface=function( width,height ){
	var canvas=document.createElement( 'canvas' );
	
	canvas.width=width;
	canvas.height=height;
	canvas.meta_width=width;
	canvas.meta_height=height;
	canvas.complete=true;
	
	var surface=new gxtkSurface( canvas,this );
	
	surface.gc=canvas.getContext( '2d' );
	
	return surface;
}

gxtkGraphics.prototype.SetAlpha=function( alpha ){
	this.alpha=alpha;
	this.gc.globalAlpha=alpha;
}

gxtkGraphics.prototype.SetColor=function( r,g,b ){
	this.r=r;
	this.g=g;
	this.b=b;
	this.white=(r==255 && g==255 && b==255);
	this.color="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
}

gxtkGraphics.prototype.SetBlend=function( blend ){
	switch( blend ){
	case 1:
		this.blend="lighter";
		break;
	default:
		this.blend="source-over";
	}
	this.gc.globalCompositeOperation=this.blend;
}

gxtkGraphics.prototype.SetScissor=function( x,y,w,h ){
	this.scissorX=x;
	this.scissorY=y;
	this.scissorWidth=w;
	this.scissorHeight=h;
	this.clipped=(x!=0 || y!=0 || w!=this.canvas.width || h!=this.canvas.height);
	this.gc.restore();
	this.gc.save();
	if( this.clipped ){
		this.gc.beginPath();
		this.gc.rect( x,y,w,h );
		this.gc.clip();
		this.gc.closePath();
	}
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;	
	this.gc.globalAlpha=this.alpha;	
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.SetMatrix=function( ix,iy,jx,jy,tx,ty ){
	this.ix=ix;this.iy=iy;
	this.jx=jx;this.jy=jy;
	this.tx=tx;this.ty=ty;
	this.gc.setTransform( ix,iy,jx,jy,tx,ty );
	this.tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
}

gxtkGraphics.prototype.Cls=function( r,g,b ){
	if( this.tformed ) this.gc.setTransform( 1,0,0,1,0,0 );
	this.gc.fillStyle="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.globalAlpha=1;
	this.gc.globalCompositeOperation="source-over";
	this.gc.fillRect( 0,0,this.canvas.width,this.canvas.height );
	this.gc.fillStyle=this.color;
	this.gc.globalAlpha=this.alpha;
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.DrawPoint=function( x,y ){
	if( this.tformed ){
		var px=x;
		x=px * this.ix + y * this.jx + this.tx;
		y=px * this.iy + y * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
		this.gc.fillRect( x,y,1,1 );
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
		this.gc.fillRect( x,y,1,1 );
	}
}

gxtkGraphics.prototype.DrawRect=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
	this.gc.fillRect( x,y,w,h );
}

gxtkGraphics.prototype.DrawLine=function( x1,y1,x2,y2 ){
	if( this.tformed ){
		var x1_t=x1 * this.ix + y1 * this.jx + this.tx;
		var y1_t=x1 * this.iy + y1 * this.jy + this.ty;
		var x2_t=x2 * this.ix + y2 * this.jx + this.tx;
		var y2_t=x2 * this.iy + y2 * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1_t,y1_t );
	  	this.gc.lineTo( x2_t,y2_t );
	  	this.gc.stroke();
	  	this.gc.closePath();
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1,y1 );
	  	this.gc.lineTo( x2,y2 );
	  	this.gc.stroke();
	  	this.gc.closePath();
	}
}

gxtkGraphics.prototype.DrawOval=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
  	var w2=w/2,h2=h/2;
	this.gc.save();
	this.gc.translate( x+w2,y+h2 );
	this.gc.scale( w2,h2 );
  	this.gc.beginPath();
	this.gc.arc( 0,0,1,0,Math.PI*2,false );
	this.gc.fill();
  	this.gc.closePath();
	this.gc.restore();
}

gxtkGraphics.prototype.DrawPoly=function( verts ){
	if( verts.length<2 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=2;i<verts.length;i+=2 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawPoly2=function( verts,surface,srx,srcy ){
	if( verts.length<4 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=4;i<verts.length;i+=4 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawSurface=function( surface,x,y ){
	if( !surface.image.complete ) return;
	
	if( this.white ){
		this.gc.drawImage( surface.image,x,y );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,0,0,surface.swidth,surface.sheight );
}

gxtkGraphics.prototype.DrawSurface2=function( surface,x,y,srcx,srcy,srcw,srch ){
	if( !surface.image.complete ) return;

	if( srcw<0 ){ srcx+=srcw;srcw=-srcw; }
	if( srch<0 ){ srcy+=srch;srch=-srch; }
	if( srcw<=0 || srch<=0 ) return;

	if( this.white ){
		this.gc.drawImage( surface.image,srcx,srcy,srcw,srch,x,y,srcw,srch );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,srcx,srcy,srcw,srch  );
}

gxtkGraphics.prototype.DrawImageTinted=function( image,dx,dy,sx,sy,sw,sh ){

	if( !this.tmpCanvas ){
		this.tmpCanvas=document.createElement( "canvas" );
	}

	if( sw>this.tmpCanvas.width || sh>this.tmpCanvas.height ){
		this.tmpCanvas.width=Math.max( sw,this.tmpCanvas.width );
		this.tmpCanvas.height=Math.max( sh,this.tmpCanvas.height );
	}
	
	var tmpGC=this.tmpCanvas.getContext( "2d" );
	tmpGC.globalCompositeOperation="copy";
	
	tmpGC.drawImage( image,sx,sy,sw,sh,0,0,sw,sh );
	
	var imgData=tmpGC.getImageData( 0,0,sw,sh );
	
	var p=imgData.data,sz=sw*sh*4,i;
	
	for( i=0;i<sz;i+=4 ){
		p[i]=p[i]*this.r/255;
		p[i+1]=p[i+1]*this.g/255;
		p[i+2]=p[i+2]*this.b/255;
	}
	
	tmpGC.putImageData( imgData,0,0 );
	
	this.gc.drawImage( this.tmpCanvas,0,0,sw,sh,dx,dy,sw,sh );
}

gxtkGraphics.prototype.ReadPixels=function( pixels,x,y,width,height,offset,pitch ){

	var imgData=this.gc.getImageData( x,y,width,height );
	
	var p=imgData.data,i=0,j=offset,px,py;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			pixels[j++]=(p[i+3]<<24)|(p[i]<<16)|(p[i+1]<<8)|p[i+2];
			i+=4;
		}
		j+=pitch-width;
	}
}

gxtkGraphics.prototype.WritePixels2=function( surface,pixels,x,y,width,height,offset,pitch ){

	if( !surface.gc ){
		if( !surface.image.complete ) return;
		var canvas=document.createElement( "canvas" );
		canvas.width=surface.swidth;
		canvas.height=surface.sheight;
		surface.gc=canvas.getContext( "2d" );
		surface.gc.globalCompositeOperation="copy";
		surface.gc.drawImage( surface.image,0,0 );
		surface.image=canvas;
	}

	var imgData=surface.gc.createImageData( width,height );

	var p=imgData.data,i=0,j=offset,px,py,argb;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			argb=pixels[j++];
			p[i]=(argb>>16) & 0xff;
			p[i+1]=(argb>>8) & 0xff;
			p[i+2]=argb & 0xff;
			p[i+3]=(argb>>24) & 0xff;
			i+=4;
		}
		j+=pitch-width;
	}
	
	surface.gc.putImageData( imgData,x,y );
}

//***** gxtkSurface class *****

function gxtkSurface( image,graphics ){
	this.image=image;
	this.graphics=graphics;
	this.swidth=image.meta_width;
	this.sheight=image.meta_height;
}

//***** GXTK API *****

gxtkSurface.prototype.Discard=function(){
	if( this.image ){
		this.image=null;
	}
}

gxtkSurface.prototype.Width=function(){
	return this.swidth;
}

gxtkSurface.prototype.Height=function(){
	return this.sheight;
}

gxtkSurface.prototype.Loaded=function(){
	return this.image.complete;
}

gxtkSurface.prototype.OnUnsafeLoadComplete=function(){
	return true;
}

//***** gxtkChannel class *****
function gxtkChannel(){
	this.sample=null;
	this.audio=null;
	this.volume=1;
	this.pan=0;
	this.rate=1;
	this.flags=0;
	this.state=0;
}

//***** gxtkAudio class *****
function gxtkAudio(){
	this.game=BBHtml5Game.Html5Game();
	this.okay=typeof(Audio)!="undefined";
	this.music=null;
	this.channels=new Array(33);
	for( var i=0;i<33;++i ){
		this.channels[i]=new gxtkChannel();
		if( !this.okay ) this.channels[i].state=-1;
	}
}

gxtkAudio.prototype.Suspend=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==1 ){
			if( chan.audio.ended && !chan.audio.loop ){
				chan.state=0;
			}else{
				chan.audio.pause();
				chan.state=3;
			}
		}
	}
}

gxtkAudio.prototype.Resume=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==3 ){
			chan.audio.play();
			chan.state=1;
		}
	}
}

gxtkAudio.prototype.LoadSample=function( path ){
	if( !this.okay ) return null;

	var audio=new Audio( this.game.PathToUrl( path ) );
	if( !audio ) return null;
	
	return new gxtkSample( audio );
}

gxtkAudio.prototype.PlaySample=function( sample,channel,flags ){
	if( !this.okay ) return;
	
	var chan=this.channels[channel];

	if( chan.state>0 ){
		chan.audio.pause();
		chan.state=0;
	}
	
	for( var i=0;i<33;++i ){
		var chan2=this.channels[i];
		if( chan2.state==1 && chan2.audio.ended && !chan2.audio.loop ) chan.state=0;
		if( chan2.state==0 && chan2.sample ){
			chan2.sample.FreeAudio( chan2.audio );
			chan2.sample=null;
			chan2.audio=null;
		}
	}

	var audio=sample.AllocAudio();
	if( !audio ) return;

	audio.loop=(flags&1)!=0;
	audio.volume=chan.volume;
	audio.play();

	chan.sample=sample;
	chan.audio=audio;
	chan.flags=flags;
	chan.state=1;
}

gxtkAudio.prototype.StopChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state>0 ){
		chan.audio.pause();
		chan.state=0;
	}
}

gxtkAudio.prototype.PauseChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==1 ){
		if( chan.audio.ended && !chan.audio.loop ){
			chan.state=0;
		}else{
			chan.audio.pause();
			chan.state=2;
		}
	}
}

gxtkAudio.prototype.ResumeChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==2 ){
		chan.audio.play();
		chan.state=1;
	}
}

gxtkAudio.prototype.ChannelState=function( channel ){
	var chan=this.channels[channel];
	if( chan.state==1 && chan.audio.ended && !chan.audio.loop ) chan.state=0;
	if( chan.state==3 ) return 1;
	return chan.state;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];
	if( chan.state>0 ) chan.audio.volume=volume;
	chan.volume=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];
	chan.pan=pan;
}

gxtkAudio.prototype.SetRate=function( channel,rate ){
	var chan=this.channels[channel];
	chan.rate=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	this.StopMusic();
	
	this.music=this.LoadSample( path );
	if( !this.music ) return;
	
	this.PlaySample( this.music,32,flags );
}

gxtkAudio.prototype.StopMusic=function(){
	this.StopChannel( 32 );

	if( this.music ){
		this.music.Discard();
		this.music=null;
	}
}

gxtkAudio.prototype.PauseMusic=function(){
	this.PauseChannel( 32 );
}

gxtkAudio.prototype.ResumeMusic=function(){
	this.ResumeChannel( 32 );
}

gxtkAudio.prototype.MusicState=function(){
	return this.ChannelState( 32 );
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){
	this.SetVolume( 32,volume );
}

//***** gxtkSample class *****

function gxtkSample( audio ){
	this.audio=audio;
	this.free=new Array();
	this.insts=new Array();
}

gxtkSample.prototype.FreeAudio=function( audio ){
	this.free.push( audio );
}

gxtkSample.prototype.AllocAudio=function(){
	var audio;
	while( this.free.length ){
		audio=this.free.pop();
		try{
			audio.currentTime=0;
			return audio;
		}catch( ex ){
			print( "AUDIO ERROR1!" );
		}
	}
	
	//Max out?
	if( this.insts.length==8 ) return null;
	
	audio=new Audio( this.audio.src );
	
	//yucky loop handler for firefox!
	//
	audio.addEventListener( 'ended',function(){
		if( this.loop ){
			try{
				this.currentTime=0;
				this.play();
			}catch( ex ){
				print( "AUDIO ERROR2!" );
			}
		}
	},false );

	this.insts.push( audio );
	return audio;
}

gxtkSample.prototype.Discard=function(){
}


function BBThread(){
	this.result=null;
	this.running=false;
}

BBThread.prototype.Start=function(){
	this.result=null;
	this.running=true;
	this.Run__UNSAFE__();
}

BBThread.prototype.IsRunning=function(){
	return this.running;
}

BBThread.prototype.Result=function(){
	return this.result;
}

BBThread.prototype.Run__UNSAFE__=function(){
	this.running=false;
}


function BBAsyncImageLoaderThread(){
	this._running=false;
}

BBAsyncImageLoaderThread.prototype.Start=function(){

	var thread=this;
	var image=new Image();

	image.onload=function( e ){
		image.meta_width=image.width;
		image.meta_height=image.height;
		thread._surface=new gxtkSurface( image,thread._device )
		thread._running=false;
	}
	
	image.onerror=function( e ){
		thread._surface=null;
		thread._running=false;
	}
	
	thread._running=true;
	
	image.src=BBGame.Game().PathToUrl( thread._path );
}

BBAsyncImageLoaderThread.prototype.IsRunning=function(){
	return this._running;
}



function BBAsyncSoundLoaderThread(){
}

BBAsyncSoundLoaderThread.prototype.Start=function(){
	this._sample=this._device.LoadSample( this._path );
}

BBAsyncSoundLoaderThread.prototype.IsRunning=function(){
	return false;
}

function c_App(){
	Object.call(this);
}
c_App.m_new=function(){
	if((bb_app__app)!=null){
		error("App has already been created");
	}
	bb_app__app=this;
	bb_app__delegate=c_GameDelegate.m_new.call(new c_GameDelegate);
	bb_app__game.SetDelegate(bb_app__delegate);
	return this;
}
c_App.prototype.p_OnCreate=function(){
	return 0;
}
c_App.prototype.p_OnSuspend=function(){
	return 0;
}
c_App.prototype.p_OnResume=function(){
	return 0;
}
c_App.prototype.p_OnUpdate=function(){
	return 0;
}
c_App.prototype.p_OnLoading=function(){
	return 0;
}
c_App.prototype.p_OnRender=function(){
	return 0;
}
c_App.prototype.p_OnClose=function(){
	bb_app_EndApp();
	return 0;
}
c_App.prototype.p_OnBack=function(){
	this.p_OnClose();
	return 0;
}
function c_NodeGraph(){
	c_App.call(this);
	this.m_numPages=0;
	this.m_nodes=new_object_array(1000);
	this.m_gameTitle="";
}
c_NodeGraph.prototype=extend_class(c_App);
c_NodeGraph.m_new=function(){
	c_App.m_new.call(this);
	return this;
}
c_NodeGraph.prototype.p_OnUpdate=function(){
	if((bb_input_MouseHit(0))!=0){
		bb_nodegraph_offsetX-=(bb_input_MouseX()-((bb_graphics_DeviceWidth()/2)|0))/bb_nodegraph_scale;
		bb_nodegraph_offsetY-=(bb_input_MouseY()-((bb_graphics_DeviceHeight()/2)|0))/bb_nodegraph_scale;
	}
	if((bb_input_KeyHit(189))!=0){
		var t_scalefactor=0.9;
		if((bb_input_KeyDown(16))!=0){
			t_scalefactor=0.6;
		}
		var t_offX=((bb_graphics_DeviceWidth()/2)|0)/bb_nodegraph_scale-((bb_graphics_DeviceWidth()/2)|0)/(bb_nodegraph_scale*t_scalefactor);
		var t_offY=((bb_graphics_DeviceHeight()/2)|0)/bb_nodegraph_scale-((bb_graphics_DeviceHeight()/2)|0)/(bb_nodegraph_scale*t_scalefactor);
		bb_nodegraph_offsetX-=t_offX;
		bb_nodegraph_offsetY-=t_offY;
		bb_nodegraph_scale=bb_nodegraph_scale*t_scalefactor;
	}else{
		if((bb_input_KeyHit(187))!=0){
			var t_scalefactor2=0.9;
			if((bb_input_KeyDown(16))!=0){
				t_scalefactor2=0.6;
			}
			var t_offX2=((bb_graphics_DeviceWidth()/2)|0)/(bb_nodegraph_scale/t_scalefactor2)-((bb_graphics_DeviceWidth()/2)|0)/bb_nodegraph_scale;
			var t_offY2=((bb_graphics_DeviceHeight()/2)|0)/(bb_nodegraph_scale/t_scalefactor2)-((bb_graphics_DeviceHeight()/2)|0)/bb_nodegraph_scale;
			bb_nodegraph_offsetX+=t_offX2;
			bb_nodegraph_offsetY+=t_offY2;
			bb_nodegraph_scale=bb_nodegraph_scale/t_scalefactor2;
		}else{
			if((bb_input_KeyHit(38))!=0){
				for(var t_idx=1;t_idx<=this.m_numPages;t_idx=t_idx+1){
					var t_node=this.m_nodes[t_idx];
					if(t_node.p_isMousedOver()){
						t_node.m_position=c_Vector.m_new.call(new c_Vector,t_node.m_position.m_X,t_node.m_position.m_Y-200.0);
					}
				}
			}else{
				if((bb_input_KeyHit(40))!=0){
					for(var t_idx2=1;t_idx2<=this.m_numPages;t_idx2=t_idx2+1){
						var t_node2=this.m_nodes[t_idx2];
						if(t_node2.p_isMousedOver()){
							t_node2.m_position=c_Vector.m_new.call(new c_Vector,t_node2.m_position.m_X,t_node2.m_position.m_Y+200.0);
						}
					}
				}else{
					if((bb_input_KeyHit(39))!=0){
						for(var t_idx3=1;t_idx3<=this.m_numPages;t_idx3=t_idx3+1){
							var t_node3=this.m_nodes[t_idx3];
							if(t_node3.p_isMousedOver()){
								t_node3.m_position=c_Vector.m_new.call(new c_Vector,t_node3.m_position.m_X+200.0,t_node3.m_position.m_Y);
							}
						}
					}else{
						if((bb_input_KeyHit(37))!=0){
							for(var t_idx4=1;t_idx4<=this.m_numPages;t_idx4=t_idx4+1){
								var t_node4=this.m_nodes[t_idx4];
								if(t_node4.p_isMousedOver()){
									t_node4.m_position=c_Vector.m_new.call(new c_Vector,t_node4.m_position.m_X-200.0,t_node4.m_position.m_Y);
								}
							}
						}else{
							if((bb_input_KeyHit(32))!=0){
								bb_nodegraph_go=!bb_nodegraph_go;
							}
						}
					}
				}
			}
		}
	}
	return 0;
}
c_NodeGraph.prototype.p_DrawThickLine=function(t_x1,t_y1,t_x2,t_y2,t_thickness){
	var t_dx=t_x2-t_x1;
	var t_dy=t_y2-t_y1;
	var t_d=Math.sqrt(t_dx*t_dx+t_dy*t_dy);
	var t_vx=t_dx/t_d;
	var t_vy=t_dy/t_d;
	var t_nx=t_vy;
	var t_ny=-t_vx;
	var t_points=new_number_array(8);
	t_points[0]=t_x1+t_nx*(t_thickness/2.0);
	t_points[1]=t_y1+t_ny*(t_thickness/2.0);
	t_points[2]=t_x1+-t_nx*(t_thickness/2.0);
	t_points[3]=t_y1+-t_ny*(t_thickness/2.0);
	t_points[4]=t_x2+-t_nx*(t_thickness/10.0);
	t_points[5]=t_y2+-t_ny*(t_thickness/10.0);
	t_points[6]=t_x2+t_nx*(t_thickness/10.0);
	t_points[7]=t_y2+t_ny*(t_thickness/10.0);
	bb_graphics_DrawPoly(t_points);
	return 0;
}
c_NodeGraph.prototype.p_OnRender=function(){
	bb_graphics_Cls(0.0,0.0,0.0);
	if(bb_nodegraph_go){
		for(var t_n1=1;t_n1<=this.m_numPages-1;t_n1=t_n1+1){
			var t_node1=this.m_nodes[t_n1];
			var t_fv=c_Vector.m_new.call(new c_Vector,0.0,0.0);
			for(var t_n2=t_n1+1;t_n2<=this.m_numPages;t_n2=t_n2+1){
				var t_node2=this.m_nodes[t_n2];
				var t_dist=t_node1.m_position.p_DistanceTo2(t_node2.m_position);
				if(t_dist>1.0){
					t_fv=t_node2.m_position.p_Copy();
					t_fv=t_fv.p_Subtract(t_node1.m_position);
					t_fv=t_fv.p_Normalize();
					t_fv=t_fv.p_Multiply(-1.0);
					if(t_dist<=100.0){
						t_fv=t_fv.p_Multiply(100.0/t_dist*(100.0/t_dist)*(100.0/t_dist));
					}else{
						if(t_node2.p_linkedTo(t_n1)){
							t_fv=t_fv.p_Multiply(-1.0);
							t_fv=t_fv.p_Multiply(t_dist/100.0*(t_dist/100.0)*(t_dist/100.0));
						}else{
							t_fv=t_fv.p_Multiply(250.0/t_dist*(250.0/t_dist));
						}
					}
					t_node1.m_velocity.p_Add(t_fv);
					t_fv=t_fv.p_Multiply(-1.0);
					t_node2.m_velocity.p_Add(t_fv);
				}
			}
		}
	}
	for(var t_idx=1;t_idx<=this.m_numPages;t_idx=t_idx+1){
		var t_node=this.m_nodes[t_idx];
		if(!t_node.p_isMousedOver()){
			bb_graphics_SetColor(128.0,128.0,128.0);
			var t_ltarr=t_node.m_linksTo;
			var t_=t_ltarr;
			var t_2=0;
			while(t_2<t_.length){
				var t_i=t_[t_2];
				t_2=t_2+1;
				if(t_i>0 && t_i!=t_idx){
					var t_toNode=this.m_nodes[t_i];
					this.p_DrawThickLine((t_node.m_position.m_X+bb_nodegraph_offsetX)*bb_nodegraph_scale,(t_node.m_position.m_Y+bb_nodegraph_offsetY)*bb_nodegraph_scale,(t_toNode.m_position.m_X+bb_nodegraph_offsetX)*bb_nodegraph_scale,(t_toNode.m_position.m_Y+bb_nodegraph_offsetY)*bb_nodegraph_scale,20.0*bb_nodegraph_scale);
				}
			}
		}
	}
	for(var t_idx2=1;t_idx2<=this.m_numPages;t_idx2=t_idx2+1){
		var t_node3=this.m_nodes[t_idx2];
		if(t_node3.p_isMousedOver()){
			bb_graphics_SetColor(0.0,255.0,0.0);
			var t_ltarr2=t_node3.m_linksTo;
			var t_3=t_ltarr2;
			var t_4=0;
			while(t_4<t_3.length){
				var t_i2=t_3[t_4];
				t_4=t_4+1;
				if(t_i2>0 && t_i2!=t_idx2){
					var t_toNode2=this.m_nodes[t_i2];
					this.p_DrawThickLine((t_node3.m_position.m_X+bb_nodegraph_offsetX)*bb_nodegraph_scale,(t_node3.m_position.m_Y+bb_nodegraph_offsetY)*bb_nodegraph_scale,(t_toNode2.m_position.m_X+bb_nodegraph_offsetX)*bb_nodegraph_scale,(t_toNode2.m_position.m_Y+bb_nodegraph_offsetY)*bb_nodegraph_scale,20.0*bb_nodegraph_scale);
				}
			}
		}
	}
	var t_page="";
	for(var t_idx3=1;t_idx3<=this.m_numPages;t_idx3=t_idx3+1){
		var t_node4=this.m_nodes[t_idx3];
		t_node4.p_draw();
		if(t_node4.p_isMousedOver()){
			t_page="Page "+String(t_node4.m_index)+t_node4.p_nodeType();
		}
		t_node4.p_tick();
	}
	bb_graphics_SetColor(255.0,255.0,255.0);
	bb_graphics_DrawText(this.m_gameTitle,((bb_graphics_DeviceWidth()/2)|0),2.0,0.5,0.0);
	bb_graphics_DrawText(t_page,((bb_graphics_DeviceWidth()/2)|0),18.0,0.5,0.0);
	if(!bb_nodegraph_go){
		bb_graphics_DrawText("Space to Play/Pause, +/- to Zoom, Click to Center",((bb_graphics_DeviceWidth()/2)|0),(bb_graphics_DeviceHeight()-14),0.5,0.0);
	}
	return 0;
}
c_NodeGraph.prototype.p_CreateInit=function(t_num,t_title){
	bb_app_SetUpdateRate(30);
	this.m_numPages=t_num;
	this.m_gameTitle=t_title;
	var t_wide=Math.ceil(Math.sqrt(this.m_numPages));
	var t_spacing=35.0;
	for(var t_i=1;t_i<=this.m_numPages;t_i=t_i+1){
		this.m_nodes[t_i]=c_Node.m_new.call(new c_Node,t_i,-(t_spacing*t_wide/2.0)+(t_i-1) % t_wide*t_spacing,-(t_spacing*t_wide/2.0)+Math.floor((t_i-1)/t_wide)*t_spacing);
	}
	bb_nodegraph_offsetX+=((bb_graphics_DeviceWidth()/2)|0)/bb_nodegraph_scale;
	bb_nodegraph_offsetY+=((bb_graphics_DeviceHeight()/2)|0)/bb_nodegraph_scale;
	return 0;
}
c_NodeGraph.prototype.p_LinkNodes=function(t_n1,t_n2,t_n3,t_n4,t_n5,t_n6,t_n7){
	this.m_nodes[t_n1].p_addLinkTo(t_n2);
	if(t_n2>0){
		this.m_nodes[t_n2].p_addLinkFrom(t_n1);
	}
	if(t_n3>0){
		this.m_nodes[t_n1].p_addLinkTo(t_n3);
		this.m_nodes[t_n3].p_addLinkFrom(t_n1);
	}
	if(t_n4>0){
		this.m_nodes[t_n1].p_addLinkTo(t_n4);
		this.m_nodes[t_n4].p_addLinkFrom(t_n1);
	}
	if(t_n5>0){
		this.m_nodes[t_n1].p_addLinkTo(t_n5);
		this.m_nodes[t_n5].p_addLinkFrom(t_n1);
	}
	if(t_n6>0){
		this.m_nodes[t_n1].p_addLinkTo(t_n6);
		this.m_nodes[t_n6].p_addLinkFrom(t_n1);
	}
	if(t_n7>0){
		this.m_nodes[t_n1].p_addLinkTo(t_n7);
		this.m_nodes[t_n7].p_addLinkFrom(t_n1);
	}
	return 0;
}
c_NodeGraph.prototype.p_NodeType=function(t_n,t_type){
	this.m_nodes[t_n].p_setType(t_type);
	return 0;
}
c_NodeGraph.prototype.p_LinkNodes2=function(t_n1,t_t1){
	this.p_NodeType(t_n1,t_t1);
	return 0;
}
c_NodeGraph.prototype.p_LinkNodes3=function(){
	return 0;
}
c_NodeGraph.prototype.p_LinkNodes4=function(t_n1,t_n2,t_t1){
	this.p_LinkNodes(t_n1,t_n2,0,0,0,0,0);
	this.p_NodeType(t_n1,t_t1);
	return 0;
}
c_NodeGraph.prototype.p_LinkNodes5=function(t_n1,t_n2,t_n3,t_t1){
	this.p_LinkNodes(t_n1,t_n2,t_n3,0,0,0,0);
	this.p_NodeType(t_n1,t_t1);
	return 0;
}
c_NodeGraph.prototype.p_LinkNodes6=function(t_n1,t_n2,t_n3,t_n4,t_t1){
	this.p_LinkNodes(t_n1,t_n2,t_n3,t_n4,0,0,0);
	this.p_NodeType(t_n1,t_t1);
	return 0;
}
c_NodeGraph.prototype.p_LinkNodes7=function(t_n1,t_n2,t_n3,t_n4,t_n5,t_t1){
	this.p_LinkNodes(t_n1,t_n2,t_n3,t_n4,t_n5,0,0);
	this.p_NodeType(t_n1,t_t1);
	return 0;
}
c_NodeGraph.prototype.p_LinkNodes8=function(t_n1,t_n2,t_n3,t_n4,t_n5,t_n6,t_t1){
	this.p_LinkNodes(t_n1,t_n2,t_n3,t_n4,t_n5,t_n6,0);
	this.p_NodeType(t_n1,t_t1);
	return 0;
}
c_NodeGraph.prototype.p_LinkNodes9=function(t_n1,t_n2,t_n3,t_n4,t_n5,t_n6,t_n7,t_t1){
	this.p_LinkNodes(t_n1,t_n2,t_n3,t_n4,t_n5,t_n6,t_n7);
	this.p_NodeType(t_n1,t_t1);
	return 0;
}
function c_Game(){
	c_NodeGraph.call(this);
}
c_Game.prototype=extend_class(c_NodeGraph);
c_Game.m_new=function(){
	c_NodeGraph.m_new.call(this);
	return this;
}
c_Game.prototype.p_OnCreate=function(){
	this.p_CreateInit(400,"Fighting Fantasy #7 - Island of the Lizard King");
	this.p_LinkNodes(1,24,33,0,0,0,0);
	this.p_LinkNodes(2,358,326,0,0,0,0);
	this.p_LinkNodes(3,161,0,0,0,0,0);
	this.p_LinkNodes(4,44,0,0,0,0,0);
	this.p_LinkNodes(5,292,119,0,0,0,0);
	this.p_LinkNodes(6,353,0,0,0,0,0);
	this.p_LinkNodes(7,317,158,0,0,0,0);
	this.p_LinkNodes(8,82,0,0,0,0,0);
	this.p_LinkNodes(9,390,0,0,0,0,0);
	this.p_LinkNodes(10,34,321,0,0,0,0);
	this.p_LinkNodes(11,121,0,0,0,0,0);
	this.p_LinkNodes(12,105,0,0,0,0,0);
	this.p_LinkNodes(13,381,118,0,0,0,0);
	this.p_LinkNodes(14,63,270,0,0,0,0);
	this.p_LinkNodes(15,379,0,0,0,0,0);
	this.p_LinkNodes(16,380,313,0,0,0,0);
	this.p_LinkNodes(17,303,0,0,0,0,0);
	this.p_LinkNodes(18,7,0,0,0,0,0);
	this.p_LinkNodes(19,392,246,0,0,0,0);
	this.p_LinkNodes(20,178,0,0,0,0,0);
	this.p_LinkNodes(21,92,222,0,0,0,0);
	this.p_LinkNodes4(22,153,"c");
	this.p_LinkNodes(23,223,0,0,0,0,0);
	this.p_LinkNodes(24,211,33,0,0,0,0);
	this.p_LinkNodes4(25,85,"c");
	this.p_LinkNodes(26,222,0,0,0,0,0);
	this.p_LinkNodes(27,388,348,0,0,0,0);
	this.p_LinkNodes(28,226,101,0,0,0,0);
	this.p_LinkNodes4(29,389,"c");
	this.p_LinkNodes4(30,65,"c");
	this.p_LinkNodes(31,390,0,0,0,0,0);
	this.p_LinkNodes(32,201,0,0,0,0,0);
	this.p_LinkNodes(33,340,24,0,0,0,0);
	this.p_LinkNodes(34,321,0,0,0,0,0);
	this.p_LinkNodes(35,119,0,0,0,0,0);
	this.p_LinkNodes(36,346,0,0,0,0,0);
	this.p_LinkNodes(37,280,0,0,0,0,0);
	this.p_LinkNodes(38,51,0,0,0,0,0);
	this.p_LinkNodes(39,207,25,0,0,0,0);
	this.p_LinkNodes(40,253,107,0,0,0,0);
	this.p_LinkNodes(41,325,0,0,0,0,0);
	this.p_LinkNodes4(42,341,"c");
	this.p_LinkNodes4(43,284,"c");
	this.p_LinkNodes(44,274,0,0,0,0,0);
	this.p_LinkNodes4(45,173,"c");
	this.p_LinkNodes(46,149,69,0,0,0,0);
	this.p_LinkNodes(47,315,0,0,0,0,0);
	this.p_LinkNodes(48,56,304,0,0,0,0);
	this.p_LinkNodes(49,362,0,0,0,0,0);
	this.p_LinkNodes(50,356,266,0,0,0,0);
	this.p_LinkNodes(51,223,0,0,0,0,0);
	this.p_LinkNodes(52,141,0,0,0,0,0);
	this.p_LinkNodes(53,256,132,0,0,0,0);
	this.p_LinkNodes(54,244,260,0,0,0,0);
	this.p_LinkNodes(55,119,0,0,0,0,0);
	this.p_LinkNodes4(56,20,"c");
	this.p_LinkNodes(57,361,19,0,0,0,0);
	this.p_LinkNodes(58,235,37,0,0,0,0);
	this.p_LinkNodes(59,108,255,0,0,0,0);
	this.p_LinkNodes4(60,192,"c");
	this.p_LinkNodes4(61,165,"c");
	this.p_LinkNodes(62,139,0,0,0,0,0);
	this.p_LinkNodes(63,147,329,0,0,0,0);
	this.p_LinkNodes(64,214,2,75,151,220,335);
	this.p_LinkNodes(65,89,365,0,0,0,0);
	this.p_LinkNodes(66,113,0,0,0,0,0);
	this.p_LinkNodes(67,168,0,0,0,0,0);
	this.p_LinkNodes(68,278,70,172,0,0,0);
	this.p_LinkNodes(69,375,0,0,0,0,0);
	this.p_LinkNodes(70,345,175,0,0,0,0);
	this.p_LinkNodes(71,276,359,0,0,0,0);
	this.p_LinkNodes(72,30,0,0,0,0,0);
	this.p_LinkNodes(73,217,396,0,0,0,0);
	this.p_LinkNodes(74,114,0,0,0,0,0);
	this.p_LinkNodes(75,155,131,0,0,0,0);
	this.p_LinkNodes4(76,66,"c");
	this.p_LinkNodes(77,289,91,0,0,0,0);
	this.p_LinkNodes(78,154,184,0,0,0,0);
	this.p_LinkNodes(79,332,97,17,0,0,0);
	this.p_LinkNodes(80,388,348,0,0,0,0);
	this.p_LinkNodes4(81,177,"c");
	this.p_LinkNodes(82,203,0,0,0,0,0);
	this.p_LinkNodes(83,334,281,0,0,0,0);
	this.p_LinkNodes(84,195,8,0,0,0,0);
	this.p_LinkNodes(85,60,239,112,0,0,0);
	this.p_LinkNodes(86,18,295,0,0,0,0);
	this.p_LinkNodes4(87,130,"c");
	this.p_LinkNodes(88,179,305,0,0,0,0);
	this.p_LinkNodes(89,269,0,0,0,0,0);
	this.p_LinkNodes(90,375,0,0,0,0,0);
	this.p_LinkNodes(91,180,0,0,0,0,0);
	this.p_LinkNodes(92,259,222,0,0,0,0);
	this.p_LinkNodes(93,214,2,75,151,183,220);
	this.p_LinkNodes(94,311,26,297,222,0,0);
	this.p_LinkNodes4(95,133,"c");
	this.p_LinkNodes(96,7,0,0,0,0,0);
	this.p_LinkNodes(97,332,17,0,0,0,0);
	this.p_LinkNodes(98,214,2,75,151,183,335);
	this.p_LinkNodes(99,387,0,0,0,0,0);
	this.p_LinkNodes(100,352,160,0,0,0,0);
	this.p_LinkNodes(101,321,0,0,0,0,0);
	this.p_LinkNodes(102,16,169,0,0,0,0);
	this.p_LinkNodes(103,15,316,0,0,0,0);
	this.p_LinkNodes(104,197,0,0,0,0,0);
	this.p_LinkNodes(105,286,375,0,0,0,0);
	this.p_LinkNodes(106,279,0,0,0,0,0);
	this.p_LinkNodes(107,210,336,245,0,0,0);
	this.p_LinkNodes4(108,79,"c");
	this.p_LinkNodes(109,268,84,0,0,0,0);
	this.p_LinkNodes(110,224,0,0,0,0,0);
	this.p_LinkNodes4(111,153,"c");
	this.p_LinkNodes4(112,192,"c");
	this.p_LinkNodes(113,7,0,0,0,0,0);
	this.p_LinkNodes(114,265,138,0,0,0,0);
	this.p_LinkNodes(115,170,0,0,0,0,0);
	this.p_LinkNodes5(116,247,27,"c");
	this.p_LinkNodes(117,46,375,349,0,0,0);
	this.p_LinkNodes(118,80,0,0,0,0,0);
	this.p_LinkNodes(119,41,325,0,0,0,0);
	this.p_LinkNodes(120,62,240,0,0,0,0);
	this.p_LinkNodes(121,251,293,32,0,0,0);
	this.p_LinkNodes(122,37,0,0,0,0,0);
	this.p_LinkNodes(123,346,0,0,0,0,0);
	this.p_LinkNodes(124,156,357,0,0,0,0);
	this.p_LinkNodes(125,214,2,75,183,220,335);
	this.p_LinkNodes(126,7,0,0,0,0,0);
	this.p_LinkNodes(127,193,120,287,0,0,0);
	this.p_LinkNodes(128,248,351,0,0,0,0);
	this.p_LinkNodes(129,324,157,0,0,0,0);
	this.p_LinkNodes(130,14,0,0,0,0,0);
	this.p_LinkNodes(131,168,0,0,0,0,0);
	this.p_LinkNodes(133,218,0,0,0,0,0);
	this.p_LinkNodes(134,92,222,0,0,0,0);
	this.p_LinkNodes(135,39,361,0,0,0,0);
	this.p_LinkNodes(136,275,312,0,0,0,0);
	this.p_LinkNodes(137,373,0,0,0,0,0);
	this.p_LinkNodes5(138,121,11,"c");
	this.p_LinkNodes4(139,95,"c");
	this.p_LinkNodes(140,378,0,0,0,0,0);
	this.p_LinkNodes(141,399,0,0,0,0,0);
	this.p_LinkNodes(142,279,0,0,0,0,0);
	this.p_LinkNodes(143,224,110,0,0,0,0);
	this.p_LinkNodes(144,173,0,0,0,0,0);
	this.p_LinkNodes(145,264,55,0,0,0,0);
	this.p_LinkNodes(146,291,0,0,0,0,0);
	this.p_LinkNodes(147,274,28,0,0,0,0);
	this.p_LinkNodes(148,80,13,0,0,0,0);
	this.p_LinkNodes(149,90,375,0,0,0,0);
	this.p_LinkNodes(150,104,159,0,0,0,0);
	this.p_LinkNodes(151,67,125,0,0,0,0);
	this.p_LinkNodes(152,391,0,0,0,0,0);
	this.p_LinkNodes(153,188,384,54,0,0,0);
	this.p_LinkNodes(154,38,319,0,0,0,0);
	this.p_LinkNodes(155,214,2,151,183,220,335);
	this.p_LinkNodes(156,5,119,0,0,0,0);
	this.p_LinkNodes5(158,394,122,"c");
	this.p_LinkNodes(159,197,0,0,0,0,0);
	this.p_LinkNodes5(160,141,52,"c");
	this.p_LinkNodes(161,74,262,0,0,0,0);
	this.p_LinkNodes(162,50,84,0,0,0,0);
	this.p_LinkNodes4(163,368,"c");
	this.p_LinkNodes(164,8,0,0,0,0,0);
	this.p_LinkNodes(165,200,398,0,0,0,0);
	this.p_LinkNodes(166,294,318,0,0,0,0);
	this.p_LinkNodes(167,170,0,0,0,0,0);
	this.p_LinkNodes(168,127,252,328,0,0,0);
	this.p_LinkNodes4(169,261,"c");
	this.p_LinkNodes(170,288,88,0,0,0,0);
	this.p_LinkNodes(171,215,302,0,0,0,0);
	this.p_LinkNodes(172,383,4,0,0,0,0);
	this.p_LinkNodes(173,393,216,0,0,0,0);
	this.p_LinkNodes(174,113,0,0,0,0,0);
	this.p_LinkNodes(175,172,278,0,0,0,0);
	this.p_LinkNodes(176,324,129,157,0,0,0);
	this.p_LinkNodes(177,229,12,0,0,0,0);
	this.p_LinkNodes(178,233,306,0,0,0,0);
	this.p_LinkNodes(179,387,0,0,0,0,0);
	this.p_LinkNodes(180,82,0,0,0,0,0);
	this.p_LinkNodes(181,230,257,0,0,0,0);
	this.p_LinkNodes(182,366,0,0,0,0,0);
	this.p_LinkNodes(183,64,283,0,0,0,0);
	this.p_LinkNodes(184,51,0,0,0,0,0);
	this.p_LinkNodes4(185,341,"c");
	this.p_LinkNodes(186,388,348,0,0,0,0);
	this.p_LinkNodes(187,377,174,113,0,0,0);
	this.p_LinkNodes(189,147,0,0,0,0,0);
	this.p_LinkNodes4(190,343,"c");
	this.p_LinkNodes4(191,122,"c");
	this.p_LinkNodes(192,57,0,0,0,0,0);
	this.p_LinkNodes(193,139,0,0,0,0,0);
	this.p_LinkNodes(194,83,382,0,0,0,0);
	this.p_LinkNodes(195,333,8,0,0,0,0);
	this.p_LinkNodes(196,128,222,0,0,0,0);
	this.p_LinkNodes(197,186,148,0,0,0,0);
	this.p_LinkNodes(198,267,152,0,0,0,0);
	this.p_LinkNodes(199,397,237,0,0,0,0);
	this.p_LinkNodes(200,391,0,0,0,0,0);
	this.p_LinkNodes(201,363,0,0,0,0,0);
	this.p_LinkNodes4(202,122,"c");
	this.p_LinkNodes(203,314,36,0,0,0,0);
	this.p_LinkNodes4(204,31,"c");
	this.p_LinkNodes4(205,343,"c");
	this.p_LinkNodes(206,7,86,359,0,0,0);
	this.p_LinkNodes(207,371,192,0,0,0,0);
	this.p_LinkNodes(208,199,0,0,0,0,0);
	this.p_LinkNodes(209,389,0,0,0,0,0);
	this.p_LinkNodes(210,253,0,0,0,0,0);
	this.p_LinkNodes(211,182,307,0,0,0,0);
	this.p_LinkNodes(212,72,30,0,0,0,0);
	this.p_LinkNodes(213,68,383,0,0,0,0);
	this.p_LinkNodes(214,168,0,0,0,0,0);
	this.p_LinkNodes(215,76,250,323,0,0,0);
	this.p_LinkNodes(216,180,0,0,0,0,0);
	this.p_LinkNodes4(217,134,"c");
	this.p_LinkNodes(218,258,146,0,0,0,0);
	this.p_LinkNodes(219,170,0,0,0,0,0);
	this.p_LinkNodes(220,98,369,0,0,0,0);
	this.p_LinkNodes(221,385,224,0,0,0,0);
	this.p_LinkNodes(222,342,167,0,0,0,0);
	this.p_LinkNodes4(223,3,"c");
	this.p_LinkNodes(224,71,232,370,0,0,0);
	this.p_LinkNodes(225,301,0,0,0,0,0);
	this.p_LinkNodes(226,213,101,0,0,0,0);
	this.p_LinkNodes(227,273,162,0,0,0,0);
	this.p_LinkNodes(228,236,103,0,0,0,0);
	this.p_LinkNodes(229,337,113,0,0,0,0);
	this.p_LinkNodes(230,197,0,0,0,0,0);
	this.p_LinkNodes(231,6,353,0,0,0,0);
	this.p_LinkNodes(232,370,71,0,0,0,0);
	this.p_LinkNodes(233,249,0,0,0,0,0);
	this.p_LinkNodes(235,272,29,0,0,0,0);
	this.p_LinkNodes(236,379,0,0,0,0,0);
	this.p_LinkNodes(237,168,0,0,0,0,0);
	this.p_LinkNodes(238,152,0,0,0,0,0);
	this.p_LinkNodes4(239,192,"c");
	this.p_LinkNodes(240,139,0,0,0,0,0);
	this.p_LinkNodes4(241,189,"c");
	this.p_LinkNodes(242,142,205,0,0,0,0);
	this.p_LinkNodes(243,7,86,359,0,0,0);
	this.p_LinkNodes(244,400,0,0,0,0,0);
	this.p_LinkNodes(245,253,0,0,0,0,0);
	this.p_LinkNodes(246,135,0,0,0,0,0);
	this.p_LinkNodes(247,27,0,0,0,0,0);
	this.p_LinkNodes4(248,21,"c");
	this.p_LinkNodes(249,199,176,0,0,0,0);
	this.p_LinkNodes(250,102,0,0,0,0,0);
	this.p_LinkNodes(251,201,0,0,0,0,0);
	this.p_LinkNodes(252,139,0,0,0,0,0);
	this.p_LinkNodes(253,382,0,0,0,0,0);
	this.p_LinkNodes4(254,299,"c");
	this.p_LinkNodes4(255,79,"c");
	this.p_LinkNodes(256,81,0,0,0,0,0);
	this.p_LinkNodes(257,150,234,0,0,0,0);
	this.p_LinkNodes(258,291,0,0,0,0,0);
	this.p_LinkNodes(259,311,26,94,297,0,0);
	this.p_LinkNodes(261,187,113,0,0,0,0);
	this.p_LinkNodes4(262,386,"c");
	this.p_LinkNodes(263,233,0,0,0,0,0);
	this.p_LinkNodes(264,124,364,0,0,0,0);
	this.p_LinkNodes(265,121,0,0,0,0,0);
	this.p_LinkNodes(266,84,0,0,0,0,0);
	this.p_LinkNodes(267,354,152,0,0,0,0);
	this.p_LinkNodes(268,166,227,0,0,0,0);
	this.p_LinkNodes(269,59,303,0,0,0,0);
	this.p_LinkNodes(270,241,43,0,0,0,0);
	this.p_LinkNodes(271,22,123,0,0,0,0);
	this.p_LinkNodes(272,209,344,0,0,0,0);
	this.p_LinkNodes(273,395,0,0,0,0,0);
	this.p_LinkNodes(274,315,28,0,0,0,0);
	this.p_LinkNodes(275,312,0,0,0,0,0);
	this.p_LinkNodes(276,243,327,126,137,0,0);
	this.p_LinkNodes(277,233,0,0,0,0,0);
	this.p_LinkNodes(278,70,172,0,0,0,0);
	this.p_LinkNodes(279,185,308,42,0,0,0);
	this.p_LinkNodes(280,362,0,0,0,0,0);
	this.p_LinkNodes(281,119,0,0,0,0,0);
	this.p_LinkNodes(282,116,27,0,0,0,0);
	this.p_LinkNodes(283,168,0,0,0,0,0);
	this.p_LinkNodes(284,147,0,0,0,0,0);
	this.p_LinkNodes(285,322,0,0,0,0,0);
	this.p_LinkNodes(286,117,375,0,0,0,0);
	this.p_LinkNodes(287,328,0,0,0,0,0);
	this.p_LinkNodes(288,387,0,0,0,0,0);
	this.p_LinkNodes(289,144,45,0,0,0,0);
	this.p_LinkNodes(290,143,110,0,0,0,0);
	this.p_LinkNodes(291,330,350,0,0,0,0);
	this.p_LinkNodes(292,119,0,0,0,0,0);
	this.p_LinkNodes(293,201,0,0,0,0,0);
	this.p_LinkNodes(294,227,0,0,0,0,0);
	this.p_LinkNodes4(295,96,"c");
	this.p_LinkNodes4(296,153,"c");
	this.p_LinkNodes(297,311,26,94,222,0,0);
	this.p_LinkNodes(298,47,0,0,0,0,0);
	this.p_LinkNodes(299,268,84,0,0,0,0);
	this.p_LinkNodes(300,150,234,0,0,0,0);
	this.p_LinkNodes(301,199,0,0,0,0,0);
	this.p_LinkNodes(302,331,102,0,0,0,0);
	this.p_LinkNodes(303,178,355,0,0,0,0);
	this.p_LinkNodes4(304,20,"c");
	this.p_LinkNodes4(305,99,"c");
	this.p_LinkNodes(306,277,263,0,0,0,0);
	this.p_LinkNodes4(308,341,"c");
	this.p_LinkNodes4(309,368,"c");
	this.p_LinkNodes(310,378,0,0,0,0,0);
	this.p_LinkNodes(311,26,94,297,222,0,0);
	this.p_LinkNodes(312,231,353,0,0,0,0);
	this.p_LinkNodes(314,296,271,0,0,0,0);
	this.p_LinkNodes(315,78,347,0,0,0,0);
	this.p_LinkNodes(316,379,0,0,0,0,0);
	this.p_LinkNodes(317,58,158,0,0,0,0);
	this.p_LinkNodes4(318,372,"c");
	this.p_LinkNodes4(319,23,"c");
	this.p_LinkNodes(320,168,0,0,0,0,0);
	this.p_LinkNodes(321,19,39,0,0,0,0);
	this.p_LinkNodes4(322,367,"c");
	this.p_LinkNodes(323,113,0,0,0,0,0);
	this.p_LinkNodes(324,225,208,0,0,0,0);
	this.p_LinkNodes4(325,196,"c");
	this.p_LinkNodes(326,168,0,0,0,0,0);
	this.p_LinkNodes(327,206,126,137,0,0,0);
	this.p_LinkNodes4(328,338,"c");
	this.p_LinkNodes(329,309,163,0,0,0,0);
	this.p_LinkNodes(330,350,0,0,0,0,0);
	this.p_LinkNodes(332,17,0,0,0,0,0);
	this.p_LinkNodes(333,164,285,0,0,0,0);
	this.p_LinkNodes(334,145,119,0,0,0,0);
	this.p_LinkNodes(335,93,320,0,0,0,0);
	this.p_LinkNodes(336,253,0,0,0,0,0);
	this.p_LinkNodes(337,171,113,0,0,0,0);
	this.p_LinkNodes(338,374,139,0,0,0,0);
	this.p_LinkNodes(339,92,222,0,0,0,0);
	this.p_LinkNodes4(340,61,"c");
	this.p_LinkNodes(341,109,254,0,0,0,0);
	this.p_LinkNodes(342,115,219,0,0,0,0);
	this.p_LinkNodes(343,279,0,0,0,0,0);
	this.p_LinkNodes4(344,389,"c");
	this.p_LinkNodes(345,172,278,0,0,0,0);
	this.p_LinkNodes4(347,23,"c");
	this.p_LinkNodes(348,212,0,0,0,0,0);
	this.p_LinkNodes(349,375,0,0,0,0,0);
	this.p_LinkNodes(350,106,190,242,0,0,0);
	this.p_LinkNodes(351,339,73,0,0,0,0);
	this.p_LinkNodes(352,399,0,0,0,0,0);
	this.p_LinkNodes(353,360,77,0,0,0,0);
	this.p_LinkNodes(354,238,152,0,0,0,0);
	this.p_LinkNodes(355,48,178,0,0,0,0);
	this.p_LinkNodes(356,395,0,0,0,0,0);
	this.p_LinkNodes(358,214,75,151,183,220,335);
	this.p_LinkNodes(359,373,0,0,0,0,0);
	this.p_LinkNodes4(360,173,"c");
	this.p_LinkNodes(361,298,47,0,0,0,0);
	this.p_LinkNodes(362,40,194,0,0,0,0);
	this.p_LinkNodes(363,228,376,0,0,0,0);
	this.p_LinkNodes(364,5,119,0,0,0,0);
	this.p_LinkNodes(365,269,0,0,0,0,0);
	this.p_LinkNodes(366,198,0,0,0,0,0);
	this.p_LinkNodes(367,8,0,0,0,0,0);
	this.p_LinkNodes(368,147,0,0,0,0,0);
	this.p_LinkNodes(369,168,0,0,0,0,0);
	this.p_LinkNodes(370,323,71,0,0,0,0);
	this.p_LinkNodes(371,57,0,0,0,0,0);
	this.p_LinkNodes(372,227,0,0,0,0,0);
	this.p_LinkNodes(373,7,0,0,0,0,0);
	this.p_LinkNodes(374,139,0,0,0,0,0);
	this.p_LinkNodes4(375,221,"c");
	this.p_LinkNodes(376,100,399,0,0,0,0);
	this.p_LinkNodes(377,113,0,0,0,0,0);
	this.p_LinkNodes(378,68,4,0,0,0,0);
	this.p_LinkNodes(379,181,300,0,0,0,0);
	this.p_LinkNodes(380,113,0,0,0,0,0);
	this.p_LinkNodes(381,388,348,0,0,0,0);
	this.p_LinkNodes(382,35,119,0,0,0,0);
	this.p_LinkNodes(383,140,310,0,0,0,0);
	this.p_LinkNodes(384,400,0,0,0,0,0);
	this.p_LinkNodes(385,290,143,110,0,0,0);
	this.p_LinkNodes(386,114,0,0,0,0,0);
	this.p_LinkNodes(387,9,204,0,0,0,0);
	this.p_LinkNodes(388,212,0,0,0,0,0);
	this.p_LinkNodes4(389,49,"c");
	this.p_LinkNodes(390,87,14,0,0,0,0);
	this.p_LinkNodes(391,53,81,0,0,0,0);
	this.p_LinkNodes(392,135,0,0,0,0,0);
	this.p_LinkNodes(393,180,0,0,0,0,0);
	this.p_LinkNodes(394,191,202,0,0,0,0);
	this.p_LinkNodes(395,136,275,312,0,0,0);
	this.p_LinkNodes4(396,134,"c");
	this.p_LinkNodes(397,2,75,151,183,220,335);
	this.p_LinkNodes(398,200,0,0,0,0,0);
	this.p_LinkNodes(399,282,27,0,0,0,0);
	this.p_LinkNodes(400,-1,0,0,0,0,0);
	return 0;
}
var bb_app__app=null;
function c_GameDelegate(){
	BBGameDelegate.call(this);
	this.m__graphics=null;
	this.m__audio=null;
	this.m__input=null;
}
c_GameDelegate.prototype=extend_class(BBGameDelegate);
c_GameDelegate.m_new=function(){
	return this;
}
c_GameDelegate.prototype.StartGame=function(){
	this.m__graphics=(new gxtkGraphics);
	bb_graphics_SetGraphicsDevice(this.m__graphics);
	bb_graphics_SetFont(null,32);
	this.m__audio=(new gxtkAudio);
	bb_audio_SetAudioDevice(this.m__audio);
	this.m__input=c_InputDevice.m_new.call(new c_InputDevice);
	bb_input_SetInputDevice(this.m__input);
	bb_app__app.p_OnCreate();
}
c_GameDelegate.prototype.SuspendGame=function(){
	bb_app__app.p_OnSuspend();
	this.m__audio.Suspend();
}
c_GameDelegate.prototype.ResumeGame=function(){
	this.m__audio.Resume();
	bb_app__app.p_OnResume();
}
c_GameDelegate.prototype.UpdateGame=function(){
	this.m__input.p_BeginUpdate();
	bb_app__app.p_OnUpdate();
	this.m__input.p_EndUpdate();
}
c_GameDelegate.prototype.RenderGame=function(){
	var t_mode=this.m__graphics.BeginRender();
	if((t_mode)!=0){
		bb_graphics_BeginRender();
	}
	if(t_mode==2){
		bb_app__app.p_OnLoading();
	}else{
		bb_app__app.p_OnRender();
	}
	if((t_mode)!=0){
		bb_graphics_EndRender();
	}
	this.m__graphics.EndRender();
}
c_GameDelegate.prototype.KeyEvent=function(t_event,t_data){
	this.m__input.p_KeyEvent(t_event,t_data);
	if(t_event!=1){
		return;
	}
	var t_1=t_data;
	if(t_1==432){
		bb_app__app.p_OnClose();
	}else{
		if(t_1==416){
			bb_app__app.p_OnBack();
		}
	}
}
c_GameDelegate.prototype.MouseEvent=function(t_event,t_data,t_x,t_y){
	this.m__input.p_MouseEvent(t_event,t_data,t_x,t_y);
}
c_GameDelegate.prototype.TouchEvent=function(t_event,t_data,t_x,t_y){
	this.m__input.p_TouchEvent(t_event,t_data,t_x,t_y);
}
c_GameDelegate.prototype.MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	this.m__input.p_MotionEvent(t_event,t_data,t_x,t_y,t_z);
}
c_GameDelegate.prototype.DiscardGraphics=function(){
	this.m__graphics.DiscardGraphics();
}
var bb_app__delegate=null;
var bb_app__game=null;
function bbMain(){
	c_Game.m_new.call(new c_Game);
	return 0;
}
var bb_graphics_device=null;
function bb_graphics_SetGraphicsDevice(t_dev){
	bb_graphics_device=t_dev;
	return 0;
}
function c_Image(){
	Object.call(this);
	this.m_surface=null;
	this.m_width=0;
	this.m_height=0;
	this.m_frames=[];
	this.m_flags=0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_source=null;
}
c_Image.m_DefaultFlags=0;
c_Image.m_new=function(){
	return this;
}
c_Image.prototype.p_SetHandle=function(t_tx,t_ty){
	this.m_tx=t_tx;
	this.m_ty=t_ty;
	this.m_flags=this.m_flags&-2;
	return 0;
}
c_Image.prototype.p_ApplyFlags=function(t_iflags){
	this.m_flags=t_iflags;
	if((this.m_flags&2)!=0){
		var t_=this.m_frames;
		var t_2=0;
		while(t_2<t_.length){
			var t_f=t_[t_2];
			t_2=t_2+1;
			t_f.m_x+=1;
		}
		this.m_width-=2;
	}
	if((this.m_flags&4)!=0){
		var t_3=this.m_frames;
		var t_4=0;
		while(t_4<t_3.length){
			var t_f2=t_3[t_4];
			t_4=t_4+1;
			t_f2.m_y+=1;
		}
		this.m_height-=2;
	}
	if((this.m_flags&1)!=0){
		this.p_SetHandle((this.m_width)/2.0,(this.m_height)/2.0);
	}
	if(this.m_frames.length==1 && this.m_frames[0].m_x==0 && this.m_frames[0].m_y==0 && this.m_width==this.m_surface.Width() && this.m_height==this.m_surface.Height()){
		this.m_flags|=65536;
	}
	return 0;
}
c_Image.prototype.p_Init=function(t_surf,t_nframes,t_iflags){
	this.m_surface=t_surf;
	this.m_width=((this.m_surface.Width()/t_nframes)|0);
	this.m_height=this.m_surface.Height();
	this.m_frames=new_object_array(t_nframes);
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		this.m_frames[t_i]=c_Frame.m_new.call(new c_Frame,t_i*this.m_width,0);
	}
	this.p_ApplyFlags(t_iflags);
	return this;
}
c_Image.prototype.p_Init2=function(t_surf,t_x,t_y,t_iwidth,t_iheight,t_nframes,t_iflags,t_src,t_srcx,t_srcy,t_srcw,t_srch){
	this.m_surface=t_surf;
	this.m_source=t_src;
	this.m_width=t_iwidth;
	this.m_height=t_iheight;
	this.m_frames=new_object_array(t_nframes);
	var t_ix=t_x;
	var t_iy=t_y;
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		if(t_ix+this.m_width>t_srcw){
			t_ix=0;
			t_iy+=this.m_height;
		}
		if(t_ix+this.m_width>t_srcw || t_iy+this.m_height>t_srch){
			error("Image frame outside surface");
		}
		this.m_frames[t_i]=c_Frame.m_new.call(new c_Frame,t_ix+t_srcx,t_iy+t_srcy);
		t_ix+=this.m_width;
	}
	this.p_ApplyFlags(t_iflags);
	return this;
}
c_Image.prototype.p_Width=function(){
	return this.m_width;
}
c_Image.prototype.p_Height=function(){
	return this.m_height;
}
c_Image.prototype.p_Frames=function(){
	return this.m_frames.length;
}
function c_GraphicsContext(){
	Object.call(this);
	this.m_defaultFont=null;
	this.m_font=null;
	this.m_firstChar=0;
	this.m_matrixSp=0;
	this.m_ix=1.0;
	this.m_iy=.0;
	this.m_jx=.0;
	this.m_jy=1.0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_tformed=0;
	this.m_matDirty=0;
	this.m_color_r=.0;
	this.m_color_g=.0;
	this.m_color_b=.0;
	this.m_alpha=.0;
	this.m_blend=0;
	this.m_scissor_x=.0;
	this.m_scissor_y=.0;
	this.m_scissor_width=.0;
	this.m_scissor_height=.0;
	this.m_matrixStack=new_number_array(192);
}
c_GraphicsContext.m_new=function(){
	return this;
}
c_GraphicsContext.prototype.p_Validate=function(){
	if((this.m_matDirty)!=0){
		bb_graphics_renderDevice.SetMatrix(bb_graphics_context.m_ix,bb_graphics_context.m_iy,bb_graphics_context.m_jx,bb_graphics_context.m_jy,bb_graphics_context.m_tx,bb_graphics_context.m_ty);
		this.m_matDirty=0;
	}
	return 0;
}
var bb_graphics_context=null;
function bb_data_FixDataPath(t_path){
	var t_i=t_path.indexOf(":/",0);
	if(t_i!=-1 && t_path.indexOf("/",0)==t_i+1){
		return t_path;
	}
	if(string_startswith(t_path,"./") || string_startswith(t_path,"/")){
		return t_path;
	}
	return "monkey://data/"+t_path;
}
function c_Frame(){
	Object.call(this);
	this.m_x=0;
	this.m_y=0;
}
c_Frame.m_new=function(t_x,t_y){
	this.m_x=t_x;
	this.m_y=t_y;
	return this;
}
c_Frame.m_new2=function(){
	return this;
}
function bb_graphics_LoadImage(t_path,t_frameCount,t_flags){
	var t_surf=bb_graphics_device.LoadSurface(bb_data_FixDataPath(t_path));
	if((t_surf)!=null){
		return (c_Image.m_new.call(new c_Image)).p_Init(t_surf,t_frameCount,t_flags);
	}
	return null;
}
function bb_graphics_LoadImage2(t_path,t_frameWidth,t_frameHeight,t_frameCount,t_flags){
	var t_surf=bb_graphics_device.LoadSurface(bb_data_FixDataPath(t_path));
	if((t_surf)!=null){
		return (c_Image.m_new.call(new c_Image)).p_Init2(t_surf,0,0,t_frameWidth,t_frameHeight,t_frameCount,t_flags,null,0,0,t_surf.Width(),t_surf.Height());
	}
	return null;
}
function bb_graphics_SetFont(t_font,t_firstChar){
	if(!((t_font)!=null)){
		if(!((bb_graphics_context.m_defaultFont)!=null)){
			bb_graphics_context.m_defaultFont=bb_graphics_LoadImage("mojo_font.png",96,2);
		}
		t_font=bb_graphics_context.m_defaultFont;
		t_firstChar=32;
	}
	bb_graphics_context.m_font=t_font;
	bb_graphics_context.m_firstChar=t_firstChar;
	return 0;
}
var bb_audio_device=null;
function bb_audio_SetAudioDevice(t_dev){
	bb_audio_device=t_dev;
	return 0;
}
function c_InputDevice(){
	Object.call(this);
	this.m__joyStates=new_object_array(4);
	this.m__keyDown=new_bool_array(512);
	this.m__keyHitPut=0;
	this.m__keyHitQueue=new_number_array(33);
	this.m__keyHit=new_number_array(512);
	this.m__charGet=0;
	this.m__charPut=0;
	this.m__charQueue=new_number_array(32);
	this.m__mouseX=.0;
	this.m__mouseY=.0;
	this.m__touchX=new_number_array(32);
	this.m__touchY=new_number_array(32);
	this.m__accelX=.0;
	this.m__accelY=.0;
	this.m__accelZ=.0;
}
c_InputDevice.m_new=function(){
	for(var t_i=0;t_i<4;t_i=t_i+1){
		this.m__joyStates[t_i]=c_JoyState.m_new.call(new c_JoyState);
	}
	return this;
}
c_InputDevice.prototype.p_PutKeyHit=function(t_key){
	if(this.m__keyHitPut==this.m__keyHitQueue.length){
		return;
	}
	this.m__keyHit[t_key]+=1;
	this.m__keyHitQueue[this.m__keyHitPut]=t_key;
	this.m__keyHitPut+=1;
}
c_InputDevice.prototype.p_BeginUpdate=function(){
	for(var t_i=0;t_i<4;t_i=t_i+1){
		var t_state=this.m__joyStates[t_i];
		if(!BBGame.Game().PollJoystick(t_i,t_state.m_joyx,t_state.m_joyy,t_state.m_joyz,t_state.m_buttons)){
			break;
		}
		for(var t_j=0;t_j<32;t_j=t_j+1){
			var t_key=256+t_i*32+t_j;
			if(t_state.m_buttons[t_j]){
				if(!this.m__keyDown[t_key]){
					this.m__keyDown[t_key]=true;
					this.p_PutKeyHit(t_key);
				}
			}else{
				this.m__keyDown[t_key]=false;
			}
		}
	}
}
c_InputDevice.prototype.p_EndUpdate=function(){
	for(var t_i=0;t_i<this.m__keyHitPut;t_i=t_i+1){
		this.m__keyHit[this.m__keyHitQueue[t_i]]=0;
	}
	this.m__keyHitPut=0;
	this.m__charGet=0;
	this.m__charPut=0;
}
c_InputDevice.prototype.p_KeyEvent=function(t_event,t_data){
	var t_1=t_event;
	if(t_1==1){
		if(!this.m__keyDown[t_data]){
			this.m__keyDown[t_data]=true;
			this.p_PutKeyHit(t_data);
			if(t_data==1){
				this.m__keyDown[384]=true;
				this.p_PutKeyHit(384);
			}else{
				if(t_data==384){
					this.m__keyDown[1]=true;
					this.p_PutKeyHit(1);
				}
			}
		}
	}else{
		if(t_1==2){
			if(this.m__keyDown[t_data]){
				this.m__keyDown[t_data]=false;
				if(t_data==1){
					this.m__keyDown[384]=false;
				}else{
					if(t_data==384){
						this.m__keyDown[1]=false;
					}
				}
			}
		}else{
			if(t_1==3){
				if(this.m__charPut<this.m__charQueue.length){
					this.m__charQueue[this.m__charPut]=t_data;
					this.m__charPut+=1;
				}
			}
		}
	}
}
c_InputDevice.prototype.p_MouseEvent=function(t_event,t_data,t_x,t_y){
	var t_2=t_event;
	if(t_2==4){
		this.p_KeyEvent(1,1+t_data);
	}else{
		if(t_2==5){
			this.p_KeyEvent(2,1+t_data);
			return;
		}else{
			if(t_2==6){
			}else{
				return;
			}
		}
	}
	this.m__mouseX=t_x;
	this.m__mouseY=t_y;
	this.m__touchX[0]=t_x;
	this.m__touchY[0]=t_y;
}
c_InputDevice.prototype.p_TouchEvent=function(t_event,t_data,t_x,t_y){
	var t_3=t_event;
	if(t_3==7){
		this.p_KeyEvent(1,384+t_data);
	}else{
		if(t_3==8){
			this.p_KeyEvent(2,384+t_data);
			return;
		}else{
			if(t_3==9){
			}else{
				return;
			}
		}
	}
	this.m__touchX[t_data]=t_x;
	this.m__touchY[t_data]=t_y;
	if(t_data==0){
		this.m__mouseX=t_x;
		this.m__mouseY=t_y;
	}
}
c_InputDevice.prototype.p_MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	var t_4=t_event;
	if(t_4==10){
	}else{
		return;
	}
	this.m__accelX=t_x;
	this.m__accelY=t_y;
	this.m__accelZ=t_z;
}
c_InputDevice.prototype.p_KeyHit=function(t_key){
	if(t_key>0 && t_key<512){
		return this.m__keyHit[t_key];
	}
	return 0;
}
c_InputDevice.prototype.p_MouseX=function(){
	return this.m__mouseX;
}
c_InputDevice.prototype.p_MouseY=function(){
	return this.m__mouseY;
}
c_InputDevice.prototype.p_KeyDown=function(t_key){
	if(t_key>0 && t_key<512){
		return this.m__keyDown[t_key];
	}
	return false;
}
function c_JoyState(){
	Object.call(this);
	this.m_joyx=new_number_array(2);
	this.m_joyy=new_number_array(2);
	this.m_joyz=new_number_array(2);
	this.m_buttons=new_bool_array(32);
}
c_JoyState.m_new=function(){
	return this;
}
var bb_input_device=null;
function bb_input_SetInputDevice(t_dev){
	bb_input_device=t_dev;
	return 0;
}
var bb_graphics_renderDevice=null;
function bb_graphics_SetMatrix(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	bb_graphics_context.m_ix=t_ix;
	bb_graphics_context.m_iy=t_iy;
	bb_graphics_context.m_jx=t_jx;
	bb_graphics_context.m_jy=t_jy;
	bb_graphics_context.m_tx=t_tx;
	bb_graphics_context.m_ty=t_ty;
	bb_graphics_context.m_tformed=((t_ix!=1.0 || t_iy!=0.0 || t_jx!=0.0 || t_jy!=1.0 || t_tx!=0.0 || t_ty!=0.0)?1:0);
	bb_graphics_context.m_matDirty=1;
	return 0;
}
function bb_graphics_SetMatrix2(t_m){
	bb_graphics_SetMatrix(t_m[0],t_m[1],t_m[2],t_m[3],t_m[4],t_m[5]);
	return 0;
}
function bb_graphics_SetColor(t_r,t_g,t_b){
	bb_graphics_context.m_color_r=t_r;
	bb_graphics_context.m_color_g=t_g;
	bb_graphics_context.m_color_b=t_b;
	bb_graphics_renderDevice.SetColor(t_r,t_g,t_b);
	return 0;
}
function bb_graphics_SetAlpha(t_alpha){
	bb_graphics_context.m_alpha=t_alpha;
	bb_graphics_renderDevice.SetAlpha(t_alpha);
	return 0;
}
function bb_graphics_SetBlend(t_blend){
	bb_graphics_context.m_blend=t_blend;
	bb_graphics_renderDevice.SetBlend(t_blend);
	return 0;
}
function bb_graphics_DeviceWidth(){
	return bb_graphics_device.Width();
}
function bb_graphics_DeviceHeight(){
	return bb_graphics_device.Height();
}
function bb_graphics_SetScissor(t_x,t_y,t_width,t_height){
	bb_graphics_context.m_scissor_x=t_x;
	bb_graphics_context.m_scissor_y=t_y;
	bb_graphics_context.m_scissor_width=t_width;
	bb_graphics_context.m_scissor_height=t_height;
	bb_graphics_renderDevice.SetScissor(((t_x)|0),((t_y)|0),((t_width)|0),((t_height)|0));
	return 0;
}
function bb_graphics_BeginRender(){
	bb_graphics_renderDevice=bb_graphics_device;
	bb_graphics_context.m_matrixSp=0;
	bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
	bb_graphics_SetColor(255.0,255.0,255.0);
	bb_graphics_SetAlpha(1.0);
	bb_graphics_SetBlend(0);
	bb_graphics_SetScissor(0.0,0.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	return 0;
}
function bb_graphics_EndRender(){
	bb_graphics_renderDevice=null;
	return 0;
}
function c_BBGameEvent(){
	Object.call(this);
}
function bb_app_EndApp(){
	error("");
	return 0;
}
function bb_input_MouseHit(t_button){
	return bb_input_device.p_KeyHit(1+t_button);
}
function bb_input_MouseX(){
	return bb_input_device.p_MouseX();
}
var bb_nodegraph_scale=0;
var bb_nodegraph_offsetX=0;
function bb_input_MouseY(){
	return bb_input_device.p_MouseY();
}
var bb_nodegraph_offsetY=0;
function bb_input_KeyHit(t_key){
	return bb_input_device.p_KeyHit(t_key);
}
function bb_input_KeyDown(t_key){
	return ((bb_input_device.p_KeyDown(t_key))?1:0);
}
function c_Node(){
	Object.call(this);
	this.m_position=null;
	this.m_linksTo=[];
	this.m_linksFrom=[];
	this.m_velocity=null;
	this.m_type="";
	this.m_index=0;
}
c_Node.prototype.p_isMousedOver=function(){
	var t_px=(this.m_position.m_X+bb_nodegraph_offsetX)*bb_nodegraph_scale;
	var t_mx1=bb_input_MouseX()-24.0*bb_nodegraph_scale;
	var t_mx2=bb_input_MouseX()+24.0*bb_nodegraph_scale;
	if(t_px>=t_mx1 && t_px<=t_mx2){
		var t_py=(this.m_position.m_Y+bb_nodegraph_offsetY)*bb_nodegraph_scale;
		var t_my1=bb_input_MouseY()-24.0*bb_nodegraph_scale;
		var t_my2=bb_input_MouseY()+24.0*bb_nodegraph_scale;
		if(t_py>=t_my1 && t_py<=t_my2){
			return true;
		}
	}
	return false;
}
c_Node.prototype.p_linkedTo=function(t__to){
	var t_isLinked=false;
	var t_=this.m_linksTo;
	var t_2=0;
	while(t_2<t_.length){
		var t_i=t_[t_2];
		t_2=t_2+1;
		if(t_i==t__to){
			t_isLinked=true;
			break;
		}
	}
	if(!t_isLinked){
		var t_3=this.m_linksFrom;
		var t_4=0;
		while(t_4<t_3.length){
			var t_j=t_3[t_4];
			t_4=t_4+1;
			if(t_j==t__to){
				t_isLinked=true;
				break;
			}
		}
	}
	return t_isLinked;
}
c_Node.prototype.p_draw=function(){
	if(this.p_isMousedOver()){
		bb_graphics_SetColor(0.0,255.0,0.0);
		bb_graphics_DrawCircle((this.m_position.m_X+bb_nodegraph_offsetX)*bb_nodegraph_scale,(this.m_position.m_Y+bb_nodegraph_offsetY)*bb_nodegraph_scale,26.0*bb_nodegraph_scale);
	}
	if(this.m_type=="?"){
		bb_graphics_SetColor(0.0,255.0,255.0);
	}else{
		if(this.m_linksTo.length==0 && this.m_linksFrom.length==0){
			bb_graphics_SetColor(0.0,0.0,255.0);
		}else{
			if(this.m_linksTo.length==0){
				bb_graphics_SetColor(255.0,0.0,0.0);
			}else{
				if(this.m_linksTo[0]==-1){
					bb_graphics_SetColor(255.0,255.0,0.0);
				}else{
					if(this.m_linksTo[0]==-2){
						bb_graphics_SetColor(255.0,180.0,0.0);
					}else{
						if(this.m_type=="c"){
							bb_graphics_SetColor(255.0,0.0,255.0);
						}else{
							if(this.m_index==1){
								bb_graphics_SetColor(0.0,255.0,0.0);
							}else{
								if(this.m_linksTo.length>0 && this.m_linksFrom.length==0){
									bb_graphics_SetColor(0.0,128.0,0.0);
								}else{
									bb_graphics_SetColor(255.0,255.0,255.0);
								}
							}
						}
					}
				}
			}
		}
	}
	bb_graphics_DrawCircle((this.m_position.m_X+bb_nodegraph_offsetX)*bb_nodegraph_scale,(this.m_position.m_Y+bb_nodegraph_offsetY)*bb_nodegraph_scale,20.0*bb_nodegraph_scale);
	return 0;
}
c_Node.prototype.p_nodeType=function(){
	if(this.m_type=="?"){
		return " - Items Required";
	}else{
		if(this.m_linksTo.length==0 && this.m_linksFrom.length==0){
			return " - Picture";
		}else{
			if(this.m_linksTo.length==0){
				return " - Bad Ending";
			}else{
				if(this.m_linksTo[0]==-1){
					return " - Good Ending";
				}else{
					if(this.m_linksTo[0]==-2){
						return " - Blah Ending";
					}else{
						if(this.m_type=="c"){
							return " - Combat";
						}else{
							if(this.m_index==1){
								return " - Start";
							}else{
								if(this.m_linksTo.length>0 && this.m_linksFrom.length==0){
									return " - Secretly Linked To";
								}else{
									return "";
								}
							}
						}
					}
				}
			}
		}
	}
}
c_Node.prototype.p_tick=function(){
	if(this.m_velocity.p_Length()>40.0){
		this.m_velocity.p_Length2(40.0);
	}
	this.m_position.p_Add(this.m_velocity);
	this.m_velocity.p_Length2(this.m_velocity.p_Length()*0.8);
	return 0;
}
c_Node.m_new=function(t__index,t__x,t__y){
	this.m_index=t__index;
	this.m_position=c_Vector.m_new.call(new c_Vector,t__x,t__y);
	this.m_velocity=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	this.m_linksFrom=[];
	this.m_linksTo=[];
	this.m_type="";
	return this;
}
c_Node.m_new2=function(){
	return this;
}
c_Node.prototype.p_addLinkTo=function(t__to){
	this.m_linksTo=resize_number_array(this.m_linksTo,this.m_linksTo.length+1);
	this.m_linksTo[this.m_linksTo.length-1]=t__to;
	return 0;
}
c_Node.prototype.p_addLinkFrom=function(t__from){
	this.m_linksFrom=resize_number_array(this.m_linksFrom,this.m_linksFrom.length+1);
	this.m_linksFrom[this.m_linksFrom.length-1]=t__from;
	return 0;
}
c_Node.prototype.p_setType=function(t__type){
	this.m_type=t__type;
	return 0;
}
function c_Vector(){
	Object.call(this);
	this.m_X=.0;
	this.m_Y=.0;
}
c_Vector.m_new=function(t_x,t_y){
	this.m_X=t_x;
	this.m_Y=t_y;
	return this;
}
c_Vector.prototype.p_DistanceTo=function(t_x,t_y){
	var t_dx=t_x-this.m_X;
	var t_dy=t_y-this.m_Y;
	return Math.sqrt(t_dx*t_dx+t_dy*t_dy);
}
c_Vector.prototype.p_DistanceTo2=function(t_Other){
	return this.p_DistanceTo(t_Other.m_X,t_Other.m_Y);
}
c_Vector.prototype.p_Copy=function(){
	var t_vector=c_Vector.m_new.call(new c_Vector,0.0,0.0);
	t_vector.m_X=this.m_X;
	t_vector.m_Y=this.m_Y;
	return t_vector;
}
c_Vector.prototype.p_Subtract=function(t_vector){
	this.m_X=this.m_X-t_vector.m_X;
	this.m_Y=this.m_Y-t_vector.m_Y;
	return this;
}
c_Vector.prototype.p_Length=function(){
	return Math.sqrt(this.m_X*this.m_X+this.m_Y*this.m_Y);
}
c_Vector.prototype.p_Multiply=function(t_Value){
	this.m_X*=t_Value;
	this.m_Y*=t_Value;
	return this;
}
c_Vector.prototype.p_Length2=function(t_length){
	if(t_length==0.0){
		this.m_X=0.0;
		this.m_Y=0.0;
		return;
	}
	if(this.m_X==0.0 && this.m_Y==0.0){
		this.m_X=t_length;
	}
	this.p_Normalize();
	this.p_Multiply(t_length);
}
c_Vector.prototype.p_Set=function(t_vector){
	this.m_X=t_vector.m_X;
	this.m_Y=t_vector.m_Y;
	return this;
}
c_Vector.prototype.p_Set2=function(t_x,t_y){
	this.m_X=t_x;
	this.m_Y=t_y;
	return this;
}
c_Vector.prototype.p_Normalize=function(){
	var t_Length=this.p_Length();
	if(t_Length==0.0){
		return this;
	}
	this.p_Set2(this.m_X/t_Length,this.m_Y/t_Length);
	return this;
}
c_Vector.prototype.p_Add=function(t_vector){
	this.m_X+=t_vector.m_X;
	this.m_Y+=t_vector.m_Y;
	return this;
}
var bb_nodegraph_go=false;
function bb_graphics_Cls(t_r,t_g,t_b){
	bb_graphics_renderDevice.Cls(t_r,t_g,t_b);
	return 0;
}
function bb_graphics_DrawPoly(t_verts){
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawPoly(t_verts);
	return 0;
}
function bb_graphics_DrawPoly2(t_verts,t_image,t_frame){
	var t_f=t_image.m_frames[t_frame];
	bb_graphics_renderDevice.DrawPoly2(t_verts,t_image.m_surface,t_f.m_x,t_f.m_y);
	return 0;
}
function bb_graphics_DrawCircle(t_x,t_y,t_r){
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawOval(t_x-t_r,t_y-t_r,t_r*2.0,t_r*2.0);
	return 0;
}
function bb_graphics_DrawImage(t_image,t_x,t_y,t_frame){
	var t_f=t_image.m_frames[t_frame];
	bb_graphics_context.p_Validate();
	if((t_image.m_flags&65536)!=0){
		bb_graphics_renderDevice.DrawSurface(t_image.m_surface,t_x-t_image.m_tx,t_y-t_image.m_ty);
	}else{
		bb_graphics_renderDevice.DrawSurface2(t_image.m_surface,t_x-t_image.m_tx,t_y-t_image.m_ty,t_f.m_x,t_f.m_y,t_image.m_width,t_image.m_height);
	}
	return 0;
}
function bb_graphics_PushMatrix(){
	var t_sp=bb_graphics_context.m_matrixSp;
	bb_graphics_context.m_matrixStack[t_sp+0]=bb_graphics_context.m_ix;
	bb_graphics_context.m_matrixStack[t_sp+1]=bb_graphics_context.m_iy;
	bb_graphics_context.m_matrixStack[t_sp+2]=bb_graphics_context.m_jx;
	bb_graphics_context.m_matrixStack[t_sp+3]=bb_graphics_context.m_jy;
	bb_graphics_context.m_matrixStack[t_sp+4]=bb_graphics_context.m_tx;
	bb_graphics_context.m_matrixStack[t_sp+5]=bb_graphics_context.m_ty;
	bb_graphics_context.m_matrixSp=t_sp+6;
	return 0;
}
function bb_graphics_Transform(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	var t_ix2=t_ix*bb_graphics_context.m_ix+t_iy*bb_graphics_context.m_jx;
	var t_iy2=t_ix*bb_graphics_context.m_iy+t_iy*bb_graphics_context.m_jy;
	var t_jx2=t_jx*bb_graphics_context.m_ix+t_jy*bb_graphics_context.m_jx;
	var t_jy2=t_jx*bb_graphics_context.m_iy+t_jy*bb_graphics_context.m_jy;
	var t_tx2=t_tx*bb_graphics_context.m_ix+t_ty*bb_graphics_context.m_jx+bb_graphics_context.m_tx;
	var t_ty2=t_tx*bb_graphics_context.m_iy+t_ty*bb_graphics_context.m_jy+bb_graphics_context.m_ty;
	bb_graphics_SetMatrix(t_ix2,t_iy2,t_jx2,t_jy2,t_tx2,t_ty2);
	return 0;
}
function bb_graphics_Transform2(t_m){
	bb_graphics_Transform(t_m[0],t_m[1],t_m[2],t_m[3],t_m[4],t_m[5]);
	return 0;
}
function bb_graphics_Translate(t_x,t_y){
	bb_graphics_Transform(1.0,0.0,0.0,1.0,t_x,t_y);
	return 0;
}
function bb_graphics_Rotate(t_angle){
	bb_graphics_Transform(Math.cos((t_angle)*D2R),-Math.sin((t_angle)*D2R),Math.sin((t_angle)*D2R),Math.cos((t_angle)*D2R),0.0,0.0);
	return 0;
}
function bb_graphics_Scale(t_x,t_y){
	bb_graphics_Transform(t_x,0.0,0.0,t_y,0.0,0.0);
	return 0;
}
function bb_graphics_PopMatrix(){
	var t_sp=bb_graphics_context.m_matrixSp-6;
	bb_graphics_SetMatrix(bb_graphics_context.m_matrixStack[t_sp+0],bb_graphics_context.m_matrixStack[t_sp+1],bb_graphics_context.m_matrixStack[t_sp+2],bb_graphics_context.m_matrixStack[t_sp+3],bb_graphics_context.m_matrixStack[t_sp+4],bb_graphics_context.m_matrixStack[t_sp+5]);
	bb_graphics_context.m_matrixSp=t_sp;
	return 0;
}
function bb_graphics_DrawImage2(t_image,t_x,t_y,t_rotation,t_scaleX,t_scaleY,t_frame){
	var t_f=t_image.m_frames[t_frame];
	bb_graphics_PushMatrix();
	bb_graphics_Translate(t_x,t_y);
	bb_graphics_Rotate(t_rotation);
	bb_graphics_Scale(t_scaleX,t_scaleY);
	bb_graphics_Translate(-t_image.m_tx,-t_image.m_ty);
	bb_graphics_context.p_Validate();
	if((t_image.m_flags&65536)!=0){
		bb_graphics_renderDevice.DrawSurface(t_image.m_surface,0.0,0.0);
	}else{
		bb_graphics_renderDevice.DrawSurface2(t_image.m_surface,0.0,0.0,t_f.m_x,t_f.m_y,t_image.m_width,t_image.m_height);
	}
	bb_graphics_PopMatrix();
	return 0;
}
function bb_graphics_DrawText(t_text,t_x,t_y,t_xalign,t_yalign){
	if(!((bb_graphics_context.m_font)!=null)){
		return 0;
	}
	var t_w=bb_graphics_context.m_font.p_Width();
	var t_h=bb_graphics_context.m_font.p_Height();
	t_x-=Math.floor((t_w*t_text.length)*t_xalign);
	t_y-=Math.floor((t_h)*t_yalign);
	for(var t_i=0;t_i<t_text.length;t_i=t_i+1){
		var t_ch=t_text.charCodeAt(t_i)-bb_graphics_context.m_firstChar;
		if(t_ch>=0 && t_ch<bb_graphics_context.m_font.p_Frames()){
			bb_graphics_DrawImage(bb_graphics_context.m_font,t_x+(t_i*t_w),t_y,t_ch);
		}
	}
	return 0;
}
var bb_app__updateRate=0;
function bb_app_SetUpdateRate(t_hertz){
	bb_app__updateRate=t_hertz;
	bb_app__game.SetUpdateRate(t_hertz);
	return 0;
}
function bbInit(){
	bb_app__app=null;
	bb_app__delegate=null;
	bb_app__game=BBGame.Game();
	bb_graphics_device=null;
	bb_graphics_context=c_GraphicsContext.m_new.call(new c_GraphicsContext);
	c_Image.m_DefaultFlags=0;
	bb_audio_device=null;
	bb_input_device=null;
	bb_graphics_renderDevice=null;
	bb_nodegraph_scale=0.4;
	bb_nodegraph_offsetX=0.0;
	bb_nodegraph_offsetY=0.0;
	bb_nodegraph_go=false;
	bb_app__updateRate=0;
}
//${TRANSCODE_END}
