import wget

ligas = [

"http://www.nvhae.com/starcraft/bgm/Guardian.attack.wav",
"http://www.nvhae.com/starcraft/bgm/BattleCruiser.selected.wav",
"http://www.nvhae.com/starcraft/bgm/BattleCruiser.moving.wav",
"http://www.nvhae.com/starcraft/bgm/Mutalisk.attack.wav",
]





for i in ligas:
	print ("descargando : " + i) 
	d = wget.download(i)

