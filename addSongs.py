# musicPath = "C:/Users/Aidan/Music/Dist/"
import os
musicPath = str(os.getcwd()).replace("\\","/") + "/"
print(musicPath)
import glob
import music_tag
json = "{"
index = 0
txtfiles = []
for file in glob.glob(musicPath + "*.mp3"):
    print(file)
    audioFile = music_tag.load_file(file)
    json += "\"" + str(audioFile["title"]) + "\": {"
    json += "\"path\": \"" + file.replace("\\","/") + "\","
    json += "\"artist\": \"" + str(audioFile["artist"]) + "\","
    json += "\"title\": \"" + str(audioFile["title"]) + "\","
    json += "\"length\": \"" + str(audioFile["#length"]) + "\""
    index += 1
    if index != len(glob.glob("*.mp3")):
        json += "},"
    else:
        json += "}}"
with open('Visualizer/songs.json', 'w') as f:
    f.write(json)
