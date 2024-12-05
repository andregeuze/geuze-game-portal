// World of Raul Enemy Class
module GP {
    export class Enemy {
        material: THREE.MeshLambertMaterial;
        mesh: THREE.Mesh;
        animationObject: GP.Animation;
        dead: boolean = false;

        minimumDistance: number = 4;
        walkSpeed: number = 0.1;
        initialHealth: number = 3;
        health: number;
        name: string;

        // Constructor
        constructor(position: THREE.Vector2) {
            var self = this;

            // Animation
            self.animationObject = new GP.Animation();

            // Properties
            self.health = self.initialHealth;

            // Mesh
            self.material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, transparent: true });
            self.mesh = new THREE.Mesh(new THREE.PlaneGeometry(3, 5), self.material);
            self.mesh.position.set(position.x, 2.5, position.y);
            self.mesh.name = self.name;
        }

        // Update the enemy
        update(vectorLookAt: THREE.Vector3) {
            var self = this;
            if (self.health > 0) {
                self.mesh.lookAt(vectorLookAt);

                var distance = vectorLookAt.distanceTo(self.mesh.position);
                if (distance > self.minimumDistance) {
                    self.mesh.translateZ(self.walkSpeed);
                }
                else if (distance < self.minimumDistance - 1) {
                    self.mesh.translateZ(-self.walkSpeed);
                }

            } else {
                if (self.dead) {
                    // Change the bool value to only activate this once.
                    self.dead = false;

                    // Color this enemy red
                    self.material.color.setHex(0xff0000);

                    // Fade out the enemy
                    self.animationObject.fadeOut(self.mesh, 0, function () {
                        self.mesh.traverse(function (object) { object.visible = false; });
                    });
                }
            }
        }
    }
}