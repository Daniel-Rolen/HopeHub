import os

if not os.path.exists('video'):
    os.makedirs('video')
    print("Created 'video' directory")
else:
    print("'video' directory already exists")

print("Contents of the root directory:")
print(os.listdir('.'))

if os.path.exists('video'):
    print("\nContents of the 'video' directory:")
    print(os.listdir('video'))
else:
    print("\n'video' directory does not exist")
