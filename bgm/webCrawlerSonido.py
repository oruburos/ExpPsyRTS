from bs4 import BeautifulSoup
from urllib.request import urlopen
import wget

url = "http://www.nvhae.com/starcraft/bgm/"
content = urlopen(url).read()
soup = BeautifulSoup(content)
print ( soup.prettify() )
links = soup.find_all('a')

for tag in links:
	link = tag.get('href',None)
	if link is not None:
		print(link)
		if link.endswith(".wav"):
			wget.download("http://www.nvhae.com/starcraft/bgm/"+link)