// World of Raul Slash Class
module GP {
    export class Slash extends Skill {
        isFired: boolean = false;
        modelObject: THREE.Object3D;

        // Animation
        direction: number = 1;
        speed: number = 1500;
        swordRotationY: number = 1.5;
        animationSlash = undefined;
        animationToDefault = undefined;
        swordIdleEnd = undefined;
        swordSlashStart = undefined;
        swordSlashEnd = undefined;

        // Constructor
        constructor() {
            super(0.75);

            // Model
            this.modelObject = GP.CACHE.get(GP.Resources.swordModel);
            this.modelObject.position.y = -5;

            this.swordIdleEnd = {
                xPos: 0,
                yPos: -1.6,
                zPos: -0.5,
                xRot: 1,
                yRot: -0.2,
                zRot: 1
            };

            this.swordSlashStart = {
                xPos: 0,
                yPos: 0,
                zPos: 0,
                xRot: 0,
                yRot: this.swordRotationY,
                zRot: 0
            };

            this.swordSlashEnd = {
                xPos: 0,
                yPos: 0,
                zPos: 0,
                xRot: -0.2,
                yRot: -this.swordRotationY,
                zRot: 0
            };
        }

        // Generate a new animation object from the given parameters
        generateNewAnimation(model, start, end, speed) {
            return new TWEEN.Tween(start)
                .to(end, speed)
                .easing(TWEEN.Easing.Exponential.Out)
                .onUpdate(function () {
                    model.rotation.x = this.xRot;
                    model.rotation.y = this.yRot;
                    model.rotation.z = this.zRot;
                    model.position.x = this.xPos;
                    model.position.y = this.yPos;
                    model.position.z = this.zPos;
                });
        }

        // Reset the position of the sword model on the screen
        resetSwordPosition() {
            var self = this;
            self.modelObject.position.x = 0;
            self.modelObject.position.y = 0;
            self.modelObject.position.z = 0;
            self.modelObject.rotation.x = 0;
            self.modelObject.rotation.y = 0;
            self.modelObject.rotation.z = 0;
        }

        // Check if this skill has been fired
        checkFired() {
            var self = this;
            if (self.isFired) {
                self.isFired = false;
                return true;
            } else {
                return false;
            }
        }

        // Animate the sword model to its default position
        animateToDefault() {
            var self = this;

            var start = $.extend(true, {}, self.swordSlashEnd);
            var end = $.extend(true, {}, self.swordIdleEnd);
            start.yRot *= self.direction;

            var animation = self.generateNewAnimation(self.modelObject, start, end, self.speed);
            animation.onComplete(function () {
                self.direction = 1;
            });
            return animation;
        }

        // Animate the slash skill on the sword model
        animateSlash() {
            var self = this;

            // Reset the sword position
            //self.resetSwordPosition();

            // Turn to the other direction
            self.direction *= -1;

            var start = $.extend(true, {}, self.swordSlashStart);
            var end = $.extend(true, {}, self.swordSlashEnd);
            start.yRot *= self.direction;
            end.yRot *= self.direction;

            var animation = self.generateNewAnimation(self.modelObject, start, end, self.speed);
            return animation;
        }

        // Fire skill
        fire(camera: THREE.Camera) {
            var self = this;

            // If the cooldown is active, return
            if (self.hasCooldown()) {
                return;
            }

            if (self.animationSlash) {
                self.animationSlash.stop();
            }

            if (self.animationToDefault) {
                self.animationToDefault.stop();
            }

            // Start the slash animation
            self.animationSlash = self.animateSlash();
            self.animationToDefault = self.animateToDefault();
            self.animationSlash.chain(self.animationToDefault);
            self.animationSlash.start();

            // Trigger the hit event
            setTimeout(function () {
                self.isFired = true;
            }, 100);
        }
    }
}