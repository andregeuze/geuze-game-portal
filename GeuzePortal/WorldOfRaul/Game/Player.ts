module GP {
    // ViewModel for the Player class
    export class PlayerViewModel {
        name: KnockoutObservable<string>;
        health: KnockoutObservable<number>;
        energy: KnockoutObservable<number>;
        experience: KnockoutObservable<number>;
        level: KnockoutObservable<number>;

        constructor() {
            this.name = ko.observable("Player One");
            this.health = ko.observable(100);
            this.energy = ko.observable(100);
            this.experience = ko.observable(0);
            this.level = ko.observable(1);
        }
    }

    // The Player class
    export class Player {

        // Fields
        camera: THREE.PerspectiveCamera;
        viewModel: PlayerViewModel;
        spotlight: THREE.SpotLight;
        primarySkill: Slash;
        alternateSkill: Skill;
        deathSkill: Skill;
        experience: number = 1;
        private regenerationRate: number = 1000;
        private regenerationTime: number = 0;

        // Controller fields
        mustDie: boolean = false;
        hasClickedLeft: boolean = false;
        hasClickedRight: boolean = false;
        enabled: boolean = false;
        dead: boolean = false;
        verticalDistance: number = 4;
        horizontalDistance: number = 0;
        velocity: THREE.Vector3;
        direction: THREE.Vector3;
        pitchObject: THREE.Object3D;
        yawObject: THREE.Object3D;
        pi2: number = Math.PI / 2;

        // Constructor
        constructor(camera: THREE.PerspectiveCamera) {
            var self = this;

            // Init the DOM events
            self.initDom();

            // Init the viewmodel
            self.viewModel = new PlayerViewModel();

            // Init the camera and controller
            self.camera = camera;
            self.initController();

            // Spotlight
            self.spotlight = new THREE.SpotLight(0xFFFFFF);
            self.spotlight.name = "spotlight1";
            self.spotlight.castShadow = true;
            self.spotlight.position.set(0, 8, 4);
            self.spotlight.shadowMapWidth = 25;
            self.spotlight.shadowMapHeight = 25;
            self.spotlight.shadowCameraNear = self.camera.near;
            self.spotlight.shadowCameraFar = 5;
            self.spotlight.shadowCameraFov = 25;
            self.yawObject.add(self.spotlight);
            self.yawObject.add(self.spotlight.target);

            // Initialize the skills
            self.initSkills();
        }

        // Init the Player controller
        initController() {
            var self = this;

            self.pitchObject = new THREE.Object3D();
            self.pitchObject.name = "pitchObject1";
            self.pitchObject.add(self.camera);

            self.velocity = new THREE.Vector3();
            self.direction = new THREE.Vector3();
            self.yawObject = new THREE.Object3D();
            self.yawObject.name = "yawObject1";
            self.yawObject.position.y = self.verticalDistance;
            self.yawObject.add(self.pitchObject);
        }

        // Init the DOM events
        initDom() {
            var self = this;

            // Handle the mouse down event
            var mouseDownHandler = function(event) {
                if (self.checkStop()) return;

                event.preventDefault();
                event.stopPropagation();
                switch (event.button) {
                    case 0:
                        self.hasClickedLeft = true;
                        break;
                    case 2:
                        self.hasClickedRight = true;
                        break;
                }
            }

            // Handle the mouse move event
            var mouseMoveHandler = function(event) {
                if (self.checkStop()) return;

                var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
                self.yawObject.rotation.y -= movementX * 0.002;
                self.pitchObject.rotation.x -= movementY * 0.002;
                self.pitchObject.rotation.x = Math.max(-self.pi2, Math.min(self.pi2, self.pitchObject.rotation.x));
            }

            // Handle the keyboard key down event
            var keyDownHandler = function(event) {
                switch (event.keyCode) {
                    case 38: // up
                    case 87: // w
                        self.direction.z = -1;
                        break;

                    case 37: // left
                    case 65: // a
                        self.direction.x = -1;
                        break;

                    case 40: // down
                    case 83: // s
                        self.direction.z = 1;
                        break;

                    case 39: // right
                    case 68: // d
                        self.direction.x = 1;
                        break;

                    case 46: // kill yourself
                        if (!self.dead) {
                            self.mustDie = true;
                        }
                        break;
                }
            }

            // Handle the keyboard key up event
            var keyUpHandler = function(event) {
                switch (event.keyCode) {
                    case 38: // up
                    case 87: // w
                        self.direction.z = 0;
                        break;

                    case 37: // left
                    case 65: // a
                        self.direction.x = 0;
                        break;

                    case 40: // down
                    case 83: // s
                        self.direction.z = 0;
                        break;

                    case 39: // right
                    case 68: // d
                        self.direction.x = 0;
                        break;
                }
            }

            // Register the mouse and keyboard events
            document.addEventListener('mousedown', mouseDownHandler, false);
            document.addEventListener('mousemove', mouseMoveHandler, false);
            document.addEventListener('keydown', keyDownHandler, false);
            document.addEventListener('keyup', keyUpHandler, false);

            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
            var element = document.body;

            if (havePointerLock) {
                $('#myModal').modal('show');

                var pointerlockchange = function () {
                    if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                        self.enabled = true;
                        $('#myModal').modal('hide');
                    } else {
                        self.enabled = false;
                        $('#myModal').modal('show');
                    }
                };

                var pointerlockerror = function (error) {
                    //$('#myModal').modal('show');
                    console.log(error)
                };

                // Hook pointer lock state change events
                document.addEventListener('pointerlockchange', pointerlockchange, false);
                document.addEventListener('mozpointerlockchange', pointerlockchange, false);
                document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
                document.addEventListener('pointerlockerror', pointerlockerror, false);
                document.addEventListener('mozpointerlockerror', pointerlockerror, false);
                document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

                $('#myModal').on('hide.bs.modal', function (e) {
                    // Ask the browser to lock the pointer
                    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
                    element.requestPointerLock();
                });
            }
        }

        // Initialize the skills
        initSkills() {
            var self = this;

            // Define the skills
            self.primarySkill = new Slash();
            self.alternateSkill = new Skill(1000);
            self.deathSkill = new Death();

            // Add the visible objects to the camera
            self.camera.add(self.primarySkill.modelObject);
        }

        // Perform the primary skill
        attack() {
            var self = this;
            self.primarySkill.fire(self.camera);
        }

        // Perform the alternate skill
        alternateAttack() {
            var self = this;
            self.alternateSkill.fire(self.camera);
        }

        // Kill the character
        death() {
            var self = this;
            self.deathSkill.fire(self.camera);
        }

        // Regenerate some stats
        regenerate() {
            var self = this;

            if (self.viewModel.energy() < 100) {
                self.viewModel.energy(self.viewModel.energy() + 1);
            }
        }

        // Check if the death animation has started playing
        isDeathInitiated() {
            var self = this;
            if (self.mustDie && !self.dead) {
                self.dead = true;
                return true;
            }
            return false;
        }

        // Check if update-code should not execute
        checkStop() {
            var self = this;
            return (self.enabled === false || self.dead);
        }

        // Update the player
        update(delta: number) {
            var self = this;

            if (self.hasClickedLeft) {
                self.attack();
            }

            if (self.hasClickedRight) {
                self.alternateAttack();
            }

            if (self.isDeathInitiated()) {
                self.death();
            }

            // Run the regeneration logic
            self.regenerationTime += delta;
            if (self.regenerationTime > self.regenerationRate) {
                self.regenerationTime = 0;
                self.regenerate();
            }

            // Update the controls if not dead
            if (self.checkStop()) return;

            delta *= 0.1;

            // Degrade the velocity over time
            self.velocity.x += (-self.velocity.x) * 0.08 * delta;
            self.velocity.z += (-self.velocity.z) * 0.08 * delta;

            // Apply player movement (Left,Right,Forward,Backward)
            if (self.direction.z !== 0) {
                self.velocity.z += 0.01 * delta * self.direction.z;
            }

            if (self.direction.x !== 0) {
                self.velocity.x += 0.01 * delta * self.direction.x;
            }

            self.yawObject.translateX(self.velocity.x);
            self.yawObject.translateZ(self.velocity.z);

            self.hasClickedLeft = false;
            self.hasClickedRight = false;
            self.mustDie = false;
        }
    }
}