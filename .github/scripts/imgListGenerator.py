import os
import json

def pullFiles(path):
    file_list = []
    for _, _, files in os.walk(path):
        for file in files:
            if file.endswith(('.png', '.jpg', '.JPG', '.jpeg', '.gif')):
                file_list.append(file)
    return file_list

retrievedFileList=pullFiles('img/gallery/')
print(retrievedFileList)

# Output to a specific location
output_path = 'img/gallery/GalleryList.json'
with open(output_path, 'w') as f:
    json.dump(retrievedFileList, f, indent=2)
    f.close