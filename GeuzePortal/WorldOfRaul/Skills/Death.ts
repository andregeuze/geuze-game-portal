// World of Raul Death Class
module GP {
    export class Death extends Skill {

        // Constructor
        constructor() {
            super(5000);
        }

        // Generate the spear mesh for the death skill
        generateSpearMesh() {
            var texture = GP.CACHE.get(GP.Resources.spear);
            var material = new THREE.MeshBasicMaterial({ map: texture, useScreenCoordinates: false, transparent: true, side: THREE.DoubleSide });
            var geometry = new THREE.PlaneGeometry(0.25, 2);
            var mesh = new THREE.Mesh(geometry, material);
            return mesh;
        }

        // Fire skill
        fire(camera: THREE.Camera) {
            var self = this;
            var direction = 1;

            // Determine the direction
            GP.Random(0.5,
                function () {
                    // left
                    direction = -1;
                },
                function () {
                    // right
                    direction = 1;
                });

            // Set all the different animation states
            var step1 = {
                start: { xRot: camera.rotation.x, yPos: camera.position.y, zPos: 1 },
                end: { xRot: camera.rotation.x + 0.2, yPos: camera.position.y + 1, zPos: -0.25 }
            };

            var step2 = {
                start: { xRot: camera.rotation.x, yPos: step1.end.yPos, zRot: 0 },
                end: { xRot: camera.rotation.x - 0.2, yPos: step1.end.yPos - 2, zRot: (direction * -0.15) }
            };

            var step3 = {
                start: { xPos: camera.position.x, yPos: step2.end.yPos, zRot: step2.end.zRot },
                end: { xPos: camera.position.x + (2.5 * direction), yPos: step2.end.yPos - 1, zRot: (direction * -Math.PI / 2) }
            };

            // Gather all the required assets
            var spear = self.generateSpearMesh();
            spear.position.set(0, -0.1, step1.start.zPos);
            spear.rotation.x = -Math.PI / 2;
            camera.add(spear);

            // Death Step #1: spear through chest + camera shake + character lifted up
            var animationCameraShakeUp = new TWEEN.Tween({ x: step1.start.xRot }).to({ x: step1.end.xRot }, 500).easing(TWEEN.Easing.Elastic.Out).onUpdate(function () { camera.rotation.x = this.x; });
            var animationCameraLiftUp = new TWEEN.Tween({ y: step1.start.yPos }).to({ y: step1.end.yPos }, 500).easing(TWEEN.Easing.Back.InOut).onUpdate(function () { camera.position.setY(this.y); });
            var animationStep1 = new TWEEN.Tween({ z: step1.start.zPos })
                .to({ z: step1.end.zPos }, 750)
                .easing(TWEEN.Easing.Back.InOut)
                .onStart(function () {
                    animationCameraShakeUp.delay(500).start();
                    animationCameraLiftUp.delay(500).start();
                })
                .onUpdate(function () {
                    spear.position.setZ(this.z);
                });

            // Death Step #2: spear out + fall down on knees + move head to one side + camera shake
            var animationCameraShakeDown = new TWEEN.Tween({ x: step1.end.xRot }).to({ x: step1.start.xRot }, 500).easing(TWEEN.Easing.Elastic.Out).onUpdate(function () { camera.rotation.x = this.x; });
            var animationCameraTiltHead = new TWEEN.Tween({ z: step2.start.zRot }).to({ z: step2.end.zRot }, 1500).easing(TWEEN.Easing.Cubic.In).onUpdate(function () { camera.rotation.z = this.z; });
            var animationCameraFallDown = new TWEEN.Tween({ y: step2.start.yPos }).to({ y: step2.end.yPos }, 1500).easing(TWEEN.Easing.Circular.In).onUpdate(function () { camera.position.setY(this.y); });
            var animationCameraShakeDownStep2 = new TWEEN.Tween({ x: step2.start.xRot }).to({ x: step2.end.xRot }, 1500).easing(TWEEN.Easing.Elastic.Out).onUpdate(function () { camera.rotation.x = this.x; });
            var animationStep2 = new TWEEN.Tween({ z: step1.end.zPos })
                .to({ z: step1.start.zPos }, 750)
                .easing(TWEEN.Easing.Back.InOut)
                .onStart(function () {
                    animationCameraShakeDown.delay(500).start();
                    animationCameraTiltHead.delay(500).start();
                    animationCameraFallDown.delay(500).start().chain(animationCameraShakeDownStep2);
                })
                .onComplete(function () {
                    console.log(camera.rotation);
                })
                .onUpdate(function () {
                    spear.position.setZ(this.z);
                }).delay(1000);

            // Death Step #3: fall to one random side + camera shake
            var animationStep3 = new TWEEN.Tween({ x: step3.start.xPos, y: step3.start.yPos, z: step3.start.zRot })
                .to({ x: step3.end.xPos, y: step3.end.yPos, z: step3.end.zRot }, 3000)
                .easing(TWEEN.Easing.Circular.In)
                .onStart(function () {
                    console.log(camera.rotation);
                })
                .onUpdate(function () {
                    camera.position.setX(this.x);
                    camera.position.setY(this.y);
                    camera.rotation.z = this.z;
                });
            var animationCameraShakeDownStep3 = new TWEEN.Tween({ z: step3.end.zRot }).to({ z: step3.end.zRot + (direction * -0.1) }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(function () { camera.rotation.z = this.z; });

            // Chain everything together and start animating
            animationStep1.chain(animationStep2);
            animationCameraShakeDownStep2.chain(animationStep3);
            animationStep3.chain(animationCameraShakeDownStep3);
            animationStep1.start();
        }
    }
}