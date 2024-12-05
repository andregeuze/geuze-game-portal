module GP {

    // Intro class
    export class GameScene extends Scene {

        // User Interface
        private hudElement: JQuery;
        private hudController: JQuery;
        private hudMouse: JQuery;

        // Fields
        private time: number;
        private started: boolean = false;
        private animationObject: Animation;
        private clock: THREE.Clock;
        private worldManager: WorldManager;
        private player: Player;

        // Constructor
        constructor() {
            super(GP.Resources.worldofraul_game, "");
            var self = this;

            // Create the scene object
            self.scene = new THREE.Scene();

            // Set the scene color
            self.clearColor = new THREE.Color("#6495ED");

            // Setup the world
            self.worldManager = new GP.WorldManager(self);

            // Camera
            var viewAngle = 55,
                aspect = window.innerWidth / window.innerHeight,
                near = 0.1,
                far = 1000;
            self.camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
            self.camera.name = "camera";

            // Player
            self.player = new Player(self.camera);
            self.scene.add(self.player.yawObject);

            // Set up the animation object
            self.animationObject = new GP.Animation();

            // Clock
            self.clock = new THREE.Clock;
            self.time = Date.now();

            // HUD
            self.initHud();
        }

        // Initialize the HUD
        initHud() {
            var self = this;

            // Initialize knockout
            ko.applyBindings(self.player.viewModel);
        }

        getPlayer() {
            return this.player;
        }

        getPlayerPosition() {
            return this.player.yawObject.position;
        }

        // Update the scene
        update() {
            super.update();
            var self = this;

            // Update logic
            var delta = Date.now() - self.time;

            // Update the player
            self.player.update(delta);

            // Update the time
            self.time = Date.now();

            // Update World
            self.worldManager.update();

            if (this.started) {
                return;
            }

            this.started = true;

            // Put the execute-once code BELOW --VVVVVVVVVVVVVVVVVVVVVVVVVVV

            // Refactor this someday when I feel good...
            // Animate the primary skill object to default position
            self.player.primarySkill.animateToDefault().start();
        }

        // Suspend this scene
        suspend() {
            super.suspend();
            var self = this;

            this.started = false;
            this.sceneFinished = false;
        }
    }
}