// The Animations for Geuze Portal
module GP {
    export class Animation {
        // The Constructor
        constructor() { }

        // The Start animation
        start(mesh, delay) {
            if (!delay) {
                delay = 0;
            }

            // Set the mesh mutations for the start animation
            var xChange = 3;
            mesh.position.x += xChange;
            var current = { x: mesh.position.x, z: mesh.position.z, opacity: mesh.material.opacity };

            var tweenZ = new TWEEN.Tween(current)
                .to({ z: 0 }, 500)
                .easing(TWEEN.Easing.Circular.Out)
                .onUpdate(function () {
                    mesh.position.z = this.z;
                })
                .delay(delay)
                .start();

            var tweenX = new TWEEN.Tween(current)
                .to({ x: mesh.position.x - xChange }, 500)
                .easing(TWEEN.Easing.Quartic.InOut)
                .onUpdate(function () {
                    mesh.position.x = this.x;
                })
                .delay(150 + delay)
                .start();

            var tweenOpacity = new TWEEN.Tween(current)
                .to({ opacity: 1 }, 500)
                .easing(TWEEN.Easing.Circular.Out)
                .onUpdate(function () {
                    mesh.material.opacity = this.opacity;
                })
                .delay(250 + delay)
                .start();
        }

        // The fade in animation
        fadeIn(mesh, delay, callback) {
            if (!delay) {
                delay = 0;
            }

            console.log(mesh);

            var current = { opacity: 0 };
            var tweenOpacity = new TWEEN.Tween(current)
                .to({ opacity: 1 }, 1000)
                .easing(TWEEN.Easing.Circular.Out)
                .onUpdate(function () {
                    mesh.material.opacity = this.opacity;
                })
                .delay(delay);

            if (callback) {
                tweenOpacity.onComplete(callback);
            }

            tweenOpacity.start();
        }

        // The fade out animation
        fadeOut(mesh, delay, callback) {
            if (!delay) {
                delay = 0;
            }

            var current = { opacity: 1 };
            var tweenOpacity = new TWEEN.Tween(current)
                .to({ opacity: 0 }, 1000)
                .easing(TWEEN.Easing.Circular.Out)
                .onUpdate(function () {
                    mesh.material.opacity = this.opacity;
                })
                .delay(delay);

            if (callback) {
                tweenOpacity.onComplete(callback);
            }

            tweenOpacity.start();
        }

        hide(mesh: THREE.Mesh) {
            if (mesh) {
                mesh.material.opacity = 0;
            }
        }

        // The click animation
        click(mesh, callBack) {
            var current = { z: mesh.position.z };
            var range = 0.2;
            var duration = 100;
            var tweenToBack = new TWEEN.Tween(current)
                .to({ z: -range }, duration)
                .easing(TWEEN.Easing.Quintic.Out)
                .onUpdate(function () { mesh.position.z = this.z; });

            var tweenToFront = new TWEEN.Tween(current)
                .to({ z: 0 }, duration)
                .easing(TWEEN.Easing.Quintic.Out)
                .onUpdate(function () { mesh.position.z = this.z; })
                .onComplete(callBack);

            tweenToBack.chain(tweenToFront);
            tweenToBack.start();
        }
    }
}