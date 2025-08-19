""" Get transcipt of a youtube video

Print an array of dictionaries of format: [
	{text: string, start: float, duration: float},
]
"""

from youtube_transcript_api import YouTubeTranscriptApi
import sys
from json import dumps

def fetch_transcript(video_id):
	"""Fetch transcript objects of a youtube video
	# 
		Args:
			video_id (str): The ID of the YouTube video.

		returns:
			list: A FetchedTranscript() object if it works fine
			None: if in error occured or no transcript found for that video
	"""
	try:
		return YouTubeTranscriptApi().fetch(video_id, languages=['ar', 'en', 'fr', 'de', 'es', 'nl'], preserve_formatting=True)
	except Exception as e:
		print(f"Error fetching transcript: {e}", file=sys.stderr)
		return None


def normalize_transcript_snippets(transcript_snippets):
	"""Extract text, start and duration values from transcript objects.

		Args:
			transcript_snippets (list): A list of transcript objects.

		returns:
			list: A list of normalized transcript dictionaries. 
	"""
	if not transcript_snippets:
		raise ValueError("No transcript objects found.")

	return [{
		"start": chunk.start,
		"duration": chunk.duration,
		"text": chunk.text
	} for chunk in transcript_snippets]


if __name__ == "__main__":
	if len(sys.argv) <= 1 or not isinstance(sys.argv[1], str):
		print(f"Usage: python {sys.argv[0].split('/')[-1]} <video_id: string>")
		sys.exit(1)
	video_id = sys.argv[1]

	transcript_objects = fetch_transcript(video_id)
	if not transcript_objects:
		print("No transcript found.")
		sys.exit(1)

	transcript_snippets = normalize_transcript_snippets(transcript_objects)
	print(dumps(transcript_snippets))

	sys.exit(0)
