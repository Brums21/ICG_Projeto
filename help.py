z = [-25, 275]

for x in range(2):
    for y in range(4):
        print("new THREE.Vector3(" + str(z[x]) + ", 0, " + str(60*y+30) +"),")
        print("new THREE.Vector3(" + str(z[x]) + ", 0, " + str(60*y-210) +"),")
