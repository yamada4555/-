const C_WALL = 0;
const C_PATH = 1;
const C_GOAL = 2;
const CELL_W = 20;
const CELL_H = 15;
let mazeCols = 5;
let mazeRows = 5;


let maze = [];

let playerPos = {x:0,y:0};

function generateMaze(width,height){
 	let validMazeFound = false;
 	mazeCols = width;
 	mazeRows = height;
 
 	while(!validMazeFound){
 		maze =Array.from({length: mazeRows},()=>Array(mazeCols).fill(C_WALL));
  
		const markPath = (r,c) =>{maze[r][c] = C_PATH;};
		const walls = [];
 
		markPath(0,0);
  
  	//初期壁
	for (const [dr,dc]of[[1,0],[0,1]]){
  
	  	const nr = dr;
	  	const nc = dc;
	  	if (nr < mazeRows && nc < mazeCols){
  		walls.push([nr,nc,0,0]);
  	
	  	}
  
	  }
  
  	//ランダム壁
  	while(walls.length > 0){
  		const idx =Math.floor(Math.random()*walls.length);
  		const[r,c,pr,pc] = walls.splice(idx,1)[0];
  		
  		if(maze[r][c] === C_WALL){
  			let adjacentPaths = 0;
  			for(const [dr,dc] of [
  			[1,0],
  			[-1,0],
  			[0,1],
  			[0,-1],
  			]){
  				const nr = r+dr;
  				const nc = c+dc;
  				if(nr >= 0&& nr < mazeRows && nc >= 0 && nc < mazeCols){
  					if(maze[nr][nc] === C_PATH) adjacentPaths++;
  				} 
  			}
  			if(adjacentPaths <= 1){
  				markPath(r,c);
  				markPath((r + pr)>>1,(c+pc)>>1);
  				for(const [dr,dc] of [
  				[1,0],
  				[-1,0],
  				[0,1],
  				[0,-1],
  				]){
  					const nr = r+dr*2;
  					const nc = c+dc*2;
  					if(nr >= 0 && nr < mazeRows && 
  					   nc >= 0 && nc < mazeCols &&
  					   maze[nr][nc] === C_WALL){
  				     	   walls.push([nr,nc,r,c]);  					   
  					   }
  				}
  			}
  		}
  	}
  
  
  
  maze[mazeRows - 1][mazeCols - 1] = C_GOAL;
  
  if(isGoalReachable()){
   validMazeFound = true;
	}

 }
 playerPos = {x:0,y:0,};
}

function isGoalReachable(){
	const visited = Array.from({length: mazeRows},() => Array(mazeCols).fill(false));
	const queue = [[0,0]];
	visited[0][0] = true;
	
	while(queue.length > 0){
		const [y,x] = queue.shift();
		if(maze[y][x] === C_GOAL) 
		return true;
		
		for(const [dy,dx] of[
			[1,0],
  			[-1,0],
  			[0,1],
  			[0,-1],
		
			]){
			const ny = y + dy;
			const nx = x + dx;
			if(ny >= 0 && ny < mazeRows && 
  			   nx >= 0 && nx < mazeCols &&
  			   !visited[ny][nx] && maze[ny][nx] !==0){
  			   visited[ny][nx] = true;
  			   queue.push([ny,nx]);
  			   }
		}
	}
	return false;
}

function drawMaze(){
	const container = document.getElementById('maze');
	container.innerHTML = '';
	container.style.gridTemplateColumns = `repeat(${mazeCols},${CELL_W}px)`;


 for(let y = 0; y < mazeRows; y++){
	for(let x = 0; x < mazeCols; x++){
		const div = document.createElement('div');
		div.classList.add('cell');
		div.style.width = `${CELL_W}px`;
		div.style.height = `${CELL_H}px`;
	
	
		if(playerPos.x === x && playerPos.y ===y){
			div.classList.add('player')	
		}
		
		
		if(maze[y][x] === C_PATH){
			div.classList.add('path');
		}
		else if(maze[y][x] === C_GOAL){
			div.classList.add('goal');
		}else{
			div.classList.add('wall');
		}
		container.appendChild(div);
		
		} 	
	}
}
//移動処理、ゴール処理
function move(dx,dy){
	const nx = playerPos.x + dx;
	const ny = playerPos.y + dy;
	if(nx >= 0&& nx < mazeCols &&
	   ny >= 0&& ny < mazeRows && maze[ny][nx] !==0){
	   	playerPos = {x:nx,y:ny};
	   	drawMaze();
	   	if(maze[ny][nx] === C_GOAL){
	   		setTimeout(()=>alert('ゴールおめでとう！'),200);
	   	}
	}
}
//移動キーの配置
document.addEventListener('keydown',(e)=>{
	switch(e.key){
	case 'ArrowUp':move(0,-1);break;
	case 'ArrowDown':move(0,1);break;
	case 'ArrowLeft':move(-1,0);break;
	case 'ArrowRight':move(1,0);break;	
	
	}
});

function startNewMaze(){
	let w = parseInt(document.getElementById('widthInput').value);
	let h = parseInt(document.getElementById('heightInput').value);
	if(isNaN(w)||w<3)w=25;
	if(isNaN(h)||h<3)h=25;
	generateMaze(w,h);
	
	drawMaze();
}
window.onload = startNewMaze;



