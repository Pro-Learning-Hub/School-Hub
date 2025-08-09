# Youtube Downloader Challenges
Challenges I faced starting from the idea untill making a fully functional, performant robust public api for youtube downloading

## Just a list of bullshit
### howto download a youtube video  youtube api is giving us hell
	- library or a binary actually to downlaod a file and you call it via Child-proccess, with execFile or spawn depending on situation..explained below.. 
###  I want fast response can't download locally then pass to user
you can't just wait with absolutely nothing untill file downlaoded on server.
	- stream responses to user when downladod stream starts
### if anothe user asked for it again in a short time.. why downlaoding twice
	- make a passthrou, and pass the video downlaod stream to a write stream to filesystem and at the same time a a stream response to the clinet
### severla users can ask the same video at the same time (kinda of a race condition)
	- make a in_progress map and map to it any incoming request, don't respond to it or keep it pinding untill the download finishes (there is a local copy of it & the original request have been fulfilled) then loop oever requests in queue and stream to them the local copy via a readableStream()
### but but but.. the library is as slow as hell, it done't talk to youtube api.. it simmulates and opened browser and scrabe the original stream url then downlads the video then let me read it, or if i'm smart i'll stream it's stdoutput
	- then forget about all the previous and  just call to instead get the stream url and you use it as you wish, ie, pass it to user
### this makes a problem..
	1. you can't control hte name of the video.. so if thisi s used regularely, user cna't know which video he just downloaded, they are all named video.mp4 or something..
		- use execfile or (execFileSync) as normal to get the url then fetch the streamUrl and using Readable.fromWeb() or the fetch response . make a streamSource and stream as normal to both file system & user.. which only takes badnwithd and very minilal cpu and memory footprint to get the URL
	2. for audio.. this idea is as slow as hell, like few kilobytes on each stem.. don't ask me how or why.. but probably becuase of the separation procces of video and audio streams or whatever..
		- if the type is mp3 get the streamSource via (spawn) instead and download the mp3 file normally via the binary and stream the stdout to the filesystem and request, like treat it as the streamSource as you were doing normally

### big problem left with us.. memory bloating and hopefully not freazing the client browser if file is large
you can't use fetch with create blob .. this means you are fetching the whole response in memory in a blog then a file snaps in in the downloads pane and it's already there

	- use <a download> approach, so it starts a native download the momet stream starts from server and this compined with first point makes a good response
### another problem.. 10 or 100 or if used withing a elearning platform, which i'm working on.. may be 100s or 1000s using it.. there is limited bandwidth
	- make another general queue or some sort rate limiting for may be 3 videos at a time.. you have 3 possible situations
		1. no vides being handled + (no video queue of cousr)
			- pass the request
		2. videos being download + there still room for another
			- pass the request
		3. videos being downlaoded + no room + requested video is already in progres
			- pass the request it will be queued for the video
		4. videos being downnlaoded + no room + requested video is not among those in progress
			- queue the request for when a video is done downloading

### if you think we are good now.. not even close..actually we are .. to be fare
untill the server get's the url and starts streaming either for mp3 or mp4.. you are left with blank static screen, nothing shows.. 

and with the current way we stream responses.. we are talking to the browser native api.. not your page.. so there is no way to detect when download starts or finishes in the page to show some loading or success messages.. 

you can do some long polling and and download status endpoint.. among other tricks you can do.. you might think of a service worker trick.. which won't work with the streaming way we are dealing with as much as i know..
or you can just show a message that dispaears with a timeout saying, download should start soon... 
so what?.. web sockets is the key here .. 

with that.. we are good.. 
i guess... 
or at least, i hope so.. 
