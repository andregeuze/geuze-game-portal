module GP {
    // The Scene Manager
    export class SceneManager {

        // Fields
        private scenes: Array<Scene>;
        private previousIndex: number;
        private activeIndex: number;

        // Constructor
        constructor() {
            this.scenes = new Array<Scene>();
        }

        // The currently active scene
        getActiveScene() {
            if (this.activeIndex === undefined) {
                return undefined;
            }
            return this.scenes[this.activeIndex];
        }

        // Add a scene to the scene list
        addScene(sceneObject: Scene) {
            // Only if it's not in there already
            if (this.alreadyExists(sceneObject.name)) return;

            // Add the scene to the scene list
            this.scenes.push(sceneObject);
        }

        // Go to a specific scene
        gotoScene(sceneName: string) {
            var self = this;

            this.scenes.some(function (scene: Scene, index: number) {
                if (scene.name == sceneName) {
                    // Suspend the active scene
                    var activeScene = self.getActiveScene();
                    if (activeScene != undefined) {
                        activeScene.suspend();
                    }

                    // Change the index from active to previous
                    self.previousIndex = self.activeIndex;

                    // Set the new active index
                    self.activeIndex = index;
                    return true;
                } else {
                    return false;
                }
            });
        }

        // Check if a scene is already added to the scene list
        alreadyExists(sceneName: string) {
            var result = this.scenes.some(function (element: Scene) {
                return element.name == sceneName;
            });

            return result;
        }

        // Update the scene manager
        update() {
            var self = this;
            var activeScene = this.getActiveScene();
            if (activeScene != undefined) {
                activeScene.update();
                if (activeScene.sceneFinished) {
                    self.gotoScene(activeScene.next);
                }
            }
        }
    }
}