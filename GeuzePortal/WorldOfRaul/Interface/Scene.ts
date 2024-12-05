module GP {
    // Class
    export class Scene {

        public camera: THREE.PerspectiveCamera;
        public scene: THREE.Scene;
        public clearColor: THREE.Color;
        public sceneFinished: boolean;

        // Constructor
        constructor(public name: string, public next: string) {
            this.clearColor = new THREE.Color("#000000");
            console.log("Scene initialized: " + this.name);
        }

        // Check if this scene is finished and can be suspended
        public isSceneFinished(): boolean {
            return this.sceneFinished;
        }

        // Suspend the scene
        public suspend() {
            console.log("Scene suspended: " + this.name);
        }

        // Update the scene
        public update() {
            TWEEN.update(undefined);
        }
    }
}