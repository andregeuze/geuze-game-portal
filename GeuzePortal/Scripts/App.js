var GP;
(function (GP) {
    // Resources enumeration
    var Resources = (function () {
        function Resources() {
        }
        Resources.browserIncompatible = "Your browser does not seem to support WebGL. Find out how to get it at http://get.webgl.org/";
        Resources.castlefloor = "castlefloor";
        Resources.grass = "grass";
        Resources.particle = "particle";
        Resources.spear = "spear";
        Resources.swordModel = "swordModel";
        Resources.treeModel = "treeModel";
        Resources.worldofraul_game = "worldofraul_game";
        Resources.levelup = "Congratulations! You reached level ";
        return Resources;
    })();
    GP.Resources = Resources;
})(GP || (GP = {}));
// The Animations for Geuze Portal
var GP;
(function (GP) {
    var Animation = (function () {
        // The Constructor
        function Animation() {
        }
        // The Start animation
        Animation.prototype.start = function (mesh, delay) {
            if (!delay) {
                delay = 0;
            }

            // Set the mesh mutations for the start animation
            var xChange = 3;
            mesh.position.x += xChange;
            var current = { x: mesh.position.x, z: mesh.position.z, opacity: mesh.material.opacity };

            var tweenZ = new TWEEN.Tween(current).to({ z: 0 }, 500).easing(TWEEN.Easing.Circular.Out).onUpdate(function () {
                mesh.position.z = this.z;
            }).delay(delay).start();

            var tweenX = new TWEEN.Tween(current).to({ x: mesh.position.x - xChange }, 500).easing(TWEEN.Easing.Quartic.InOut).onUpdate(function () {
                mesh.position.x = this.x;
            }).delay(150 + delay).start();

            var tweenOpacity = new TWEEN.Tween(current).to({ opacity: 1 }, 500).easing(TWEEN.Easing.Circular.Out).onUpdate(function () {
                mesh.material.opacity = this.opacity;
            }).delay(250 + delay).start();
        };

        // The fade in animation
        Animation.prototype.fadeIn = function (mesh, delay, callback) {
            if (!delay) {
                delay = 0;
            }

            console.log(mesh);

            var current = { opacity: 0 };
            var tweenOpacity = new TWEEN.Tween(current).to({ opacity: 1 }, 1000).easing(TWEEN.Easing.Circular.Out).onUpdate(function () {
                mesh.material.opacity = this.opacity;
            }).delay(delay);

            if (callback) {
                tweenOpacity.onComplete(callback);
            }

            tweenOpacity.start();
        };

        // The fade out animation
        Animation.prototype.fadeOut = function (mesh, delay, callback) {
            if (!delay) {
                delay = 0;
            }

            var current = { opacity: 1 };
            var tweenOpacity = new TWEEN.Tween(current).to({ opacity: 0 }, 1000).easing(TWEEN.Easing.Circular.Out).onUpdate(function () {
                mesh.material.opacity = this.opacity;
            }).delay(delay);

            if (callback) {
                tweenOpacity.onComplete(callback);
            }

            tweenOpacity.start();
        };

        Animation.prototype.hide = function (mesh) {
            if (mesh) {
                mesh.material.opacity = 0;
            }
        };

        // The click animation
        Animation.prototype.click = function (mesh, callBack) {
            var current = { z: mesh.position.z };
            var range = 0.2;
            var duration = 100;
            var tweenToBack = new TWEEN.Tween(current).to({ z: -range }, duration).easing(TWEEN.Easing.Quintic.Out).onUpdate(function () {
                mesh.position.z = this.z;
            });

            var tweenToFront = new TWEEN.Tween(current).to({ z: 0 }, duration).easing(TWEEN.Easing.Quintic.Out).onUpdate(function () {
                mesh.position.z = this.z;
            }).onComplete(callBack);

            tweenToBack.chain(tweenToFront);
            tweenToBack.start();
        };
        return Animation;
    })();
    GP.Animation = Animation;
})(GP || (GP = {}));
var GP;
(function (GP) {
    // Class
    var Scene = (function () {
        // Constructor
        function Scene(name, next) {
            this.name = name;
            this.next = next;
            this.clearColor = new THREE.Color("#000000");
            console.log("Scene initialized: " + this.name);
        }
        // Check if this scene is finished and can be suspended
        Scene.prototype.isSceneFinished = function () {
            return this.sceneFinished;
        };

        // Suspend the scene
        Scene.prototype.suspend = function () {
            console.log("Scene suspended: " + this.name);
        };

        // Update the scene
        Scene.prototype.update = function () {
            TWEEN.update(undefined);
        };
        return Scene;
    })();
    GP.Scene = Scene;
})(GP || (GP = {}));
// World of Raul Skill Class
var GP;
(function (GP) {
    var Skill = (function () {
        // Constructor
        function Skill(interval) {
            this.interval = interval;
            var self = this;
            self.clock = new THREE.Clock();
            self.energyCost = 5;
        }
        // Check if the skill has cooldown
        Skill.prototype.hasCooldown = function () {
            var self = this, time;

            if (self.clock.running) {
                // Clock is running so get the time
                time = self.clock.getElapsedTime();
                if (time > self.interval) {
                    // Interval is over, reset the clock and allow the skill to fire again.
                    self.clock.elapsedTime = 0;
                    return false;
                } else {
                    // Interval is not over yet, so continue to block the skill
                    return true;
                }
            } else {
                // Clock is not running so return a negative result
                time = self.clock.getElapsedTime();
                return false;
            }
        };

        // Fire the skill
        Skill.prototype.fire = function (camera) {
        };
        return Skill;
    })();
    GP.Skill = Skill;
})(GP || (GP = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// World of Raul Death Class
var GP;
(function (GP) {
    var Death = (function (_super) {
        __extends(Death, _super);
        // Constructor
        function Death() {
            _super.call(this, 5000);
        }
        // Generate the spear mesh for the death skill
        Death.prototype.generateSpearMesh = function () {
            var texture = GP.CACHE.get(GP.Resources.spear);
            var material = new THREE.MeshBasicMaterial({ map: texture, useScreenCoordinates: false, transparent: true, side: THREE.DoubleSide });
            var geometry = new THREE.PlaneGeometry(0.25, 2);
            var mesh = new THREE.Mesh(geometry, material);
            return mesh;
        };

        // Fire skill
        Death.prototype.fire = function (camera) {
            var self = this;
            var direction = 1;

            // Determine the direction
            GP.Random(0.5, function () {
                // left
                direction = -1;
            }, function () {
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
            var animationCameraShakeUp = new TWEEN.Tween({ x: step1.start.xRot }).to({ x: step1.end.xRot }, 500).easing(TWEEN.Easing.Elastic.Out).onUpdate(function () {
                camera.rotation.x = this.x;
            });
            var animationCameraLiftUp = new TWEEN.Tween({ y: step1.start.yPos }).to({ y: step1.end.yPos }, 500).easing(TWEEN.Easing.Back.InOut).onUpdate(function () {
                camera.position.setY(this.y);
            });
            var animationStep1 = new TWEEN.Tween({ z: step1.start.zPos }).to({ z: step1.end.zPos }, 750).easing(TWEEN.Easing.Back.InOut).onStart(function () {
                animationCameraShakeUp.delay(500).start();
                animationCameraLiftUp.delay(500).start();
            }).onUpdate(function () {
                spear.position.setZ(this.z);
            });

            // Death Step #2: spear out + fall down on knees + move head to one side + camera shake
            var animationCameraShakeDown = new TWEEN.Tween({ x: step1.end.xRot }).to({ x: step1.start.xRot }, 500).easing(TWEEN.Easing.Elastic.Out).onUpdate(function () {
                camera.rotation.x = this.x;
            });
            var animationCameraTiltHead = new TWEEN.Tween({ z: step2.start.zRot }).to({ z: step2.end.zRot }, 1500).easing(TWEEN.Easing.Cubic.In).onUpdate(function () {
                camera.rotation.z = this.z;
            });
            var animationCameraFallDown = new TWEEN.Tween({ y: step2.start.yPos }).to({ y: step2.end.yPos }, 1500).easing(TWEEN.Easing.Circular.In).onUpdate(function () {
                camera.position.setY(this.y);
            });
            var animationCameraShakeDownStep2 = new TWEEN.Tween({ x: step2.start.xRot }).to({ x: step2.end.xRot }, 1500).easing(TWEEN.Easing.Elastic.Out).onUpdate(function () {
                camera.rotation.x = this.x;
            });
            var animationStep2 = new TWEEN.Tween({ z: step1.end.zPos }).to({ z: step1.start.zPos }, 750).easing(TWEEN.Easing.Back.InOut).onStart(function () {
                animationCameraShakeDown.delay(500).start();
                animationCameraTiltHead.delay(500).start();
                animationCameraFallDown.delay(500).start().chain(animationCameraShakeDownStep2);
            }).onComplete(function () {
                console.log(camera.rotation);
            }).onUpdate(function () {
                spear.position.setZ(this.z);
            }).delay(1000);

            // Death Step #3: fall to one random side + camera shake
            var animationStep3 = new TWEEN.Tween({ x: step3.start.xPos, y: step3.start.yPos, z: step3.start.zRot }).to({ x: step3.end.xPos, y: step3.end.yPos, z: step3.end.zRot }, 3000).easing(TWEEN.Easing.Circular.In).onStart(function () {
                console.log(camera.rotation);
            }).onUpdate(function () {
                camera.position.setX(this.x);
                camera.position.setY(this.y);
                camera.rotation.z = this.z;
            });
            var animationCameraShakeDownStep3 = new TWEEN.Tween({ z: step3.end.zRot }).to({ z: step3.end.zRot + (direction * -0.1) }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(function () {
                camera.rotation.z = this.z;
            });

            // Chain everything together and start animating
            animationStep1.chain(animationStep2);
            animationCameraShakeDownStep2.chain(animationStep3);
            animationStep3.chain(animationCameraShakeDownStep3);
            animationStep1.start();
        };
        return Death;
    })(GP.Skill);
    GP.Death = Death;
})(GP || (GP = {}));
// World of Raul Slash Class
var GP;
(function (GP) {
    var Slash = (function (_super) {
        __extends(Slash, _super);
        // Constructor
        function Slash() {
            _super.call(this, 0.75);
            this.isFired = false;
            // Animation
            this.direction = 1;
            this.speed = 1500;
            this.swordRotationY = 1.5;
            this.animationSlash = undefined;
            this.animationToDefault = undefined;
            this.swordIdleEnd = undefined;
            this.swordSlashStart = undefined;
            this.swordSlashEnd = undefined;

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
        Slash.prototype.generateNewAnimation = function (model, start, end, speed) {
            return new TWEEN.Tween(start).to(end, speed).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
                model.rotation.x = this.xRot;
                model.rotation.y = this.yRot;
                model.rotation.z = this.zRot;
                model.position.x = this.xPos;
                model.position.y = this.yPos;
                model.position.z = this.zPos;
            });
        };

        // Reset the position of the sword model on the screen
        Slash.prototype.resetSwordPosition = function () {
            var self = this;
            self.modelObject.position.x = 0;
            self.modelObject.position.y = 0;
            self.modelObject.position.z = 0;
            self.modelObject.rotation.x = 0;
            self.modelObject.rotation.y = 0;
            self.modelObject.rotation.z = 0;
        };

        // Check if this skill has been fired
        Slash.prototype.checkFired = function () {
            var self = this;
            if (self.isFired) {
                self.isFired = false;
                return true;
            } else {
                return false;
            }
        };

        // Animate the sword model to its default position
        Slash.prototype.animateToDefault = function () {
            var self = this;

            var start = $.extend(true, {}, self.swordSlashEnd);
            var end = $.extend(true, {}, self.swordIdleEnd);
            start.yRot *= self.direction;

            var animation = self.generateNewAnimation(self.modelObject, start, end, self.speed);
            animation.onComplete(function () {
                self.direction = 1;
            });
            return animation;
        };

        // Animate the slash skill on the sword model
        Slash.prototype.animateSlash = function () {
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
        };

        // Fire skill
        Slash.prototype.fire = function (camera) {
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
        };
        return Slash;
    })(GP.Skill);
    GP.Slash = Slash;
})(GP || (GP = {}));
var GP;
(function (GP) {
    // ViewModel for the Player class
    var PlayerViewModel = (function () {
        function PlayerViewModel() {
            this.name = ko.observable("Player One");
            this.health = ko.observable(100);
            this.energy = ko.observable(100);
            this.experience = ko.observable(0);
            this.level = ko.observable(1);
        }
        return PlayerViewModel;
    })();
    GP.PlayerViewModel = PlayerViewModel;

    // The Player class
    var Player = (function () {
        // Constructor
        function Player(camera) {
            this.experience = 1;
            this.regenerationRate = 1000;
            this.regenerationTime = 0;
            // Controller fields
            this.mustDie = false;
            this.hasClickedLeft = false;
            this.hasClickedRight = false;
            this.enabled = false;
            this.dead = false;
            this.verticalDistance = 4;
            this.horizontalDistance = 0;
            this.pi2 = Math.PI / 2;
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
        Player.prototype.initController = function () {
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
        };

        // Init the DOM events
        Player.prototype.initDom = function () {
            var self = this;

            // Handle the mouse down event
            var mouseDownHandler = function (event) {
                if (self.checkStop())
                    return;

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
            };

            // Handle the mouse move event
            var mouseMoveHandler = function (event) {
                if (self.checkStop())
                    return;

                var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
                self.yawObject.rotation.y -= movementX * 0.002;
                self.pitchObject.rotation.x -= movementY * 0.002;
                self.pitchObject.rotation.x = Math.max(-self.pi2, Math.min(self.pi2, self.pitchObject.rotation.x));
            };

            // Handle the keyboard key down event
            var keyDownHandler = function (event) {
                switch (event.keyCode) {
                    case 38:
                    case 87:
                        self.direction.z = -1;
                        break;

                    case 37:
                    case 65:
                        self.direction.x = -1;
                        break;

                    case 40:
                    case 83:
                        self.direction.z = 1;
                        break;

                    case 39:
                    case 68:
                        self.direction.x = 1;
                        break;

                    case 46:
                        if (!self.dead) {
                            self.mustDie = true;
                        }
                        break;
                }
            };

            // Handle the keyboard key up event
            var keyUpHandler = function (event) {
                switch (event.keyCode) {
                    case 38:
                    case 87:
                        self.direction.z = 0;
                        break;

                    case 37:
                    case 65:
                        self.direction.x = 0;
                        break;

                    case 40:
                    case 83:
                        self.direction.z = 0;
                        break;

                    case 39:
                    case 68:
                        self.direction.x = 0;
                        break;
                }
            };

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
                    console.log(error);
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
        };

        // Initialize the skills
        Player.prototype.initSkills = function () {
            var self = this;

            // Define the skills
            self.primarySkill = new GP.Slash();
            self.alternateSkill = new GP.Skill(1000);
            self.deathSkill = new GP.Death();

            // Add the visible objects to the camera
            self.camera.add(self.primarySkill.modelObject);
        };

        // Perform the primary skill
        Player.prototype.attack = function () {
            var self = this;
            self.primarySkill.fire(self.camera);
        };

        // Perform the alternate skill
        Player.prototype.alternateAttack = function () {
            var self = this;
            self.alternateSkill.fire(self.camera);
        };

        // Kill the character
        Player.prototype.death = function () {
            var self = this;
            self.deathSkill.fire(self.camera);
        };

        // Regenerate some stats
        Player.prototype.regenerate = function () {
            var self = this;

            if (self.viewModel.energy() < 100) {
                self.viewModel.energy(self.viewModel.energy() + 1);
            }
        };

        // Check if the death animation has started playing
        Player.prototype.isDeathInitiated = function () {
            var self = this;
            if (self.mustDie && !self.dead) {
                self.dead = true;
                return true;
            }
            return false;
        };

        // Check if update-code should not execute
        Player.prototype.checkStop = function () {
            var self = this;
            return (self.enabled === false || self.dead);
        };

        // Update the player
        Player.prototype.update = function (delta) {
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
            if (self.checkStop())
                return;

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
        };
        return Player;
    })();
    GP.Player = Player;
})(GP || (GP = {}));
// World of Raul Enemy Class
var GP;
(function (GP) {
    var Enemy = (function () {
        // Constructor
        function Enemy(position) {
            this.dead = false;
            this.minimumDistance = 4;
            this.walkSpeed = 0.1;
            this.initialHealth = 3;
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
        Enemy.prototype.update = function (vectorLookAt) {
            var self = this;
            if (self.health > 0) {
                self.mesh.lookAt(vectorLookAt);

                var distance = vectorLookAt.distanceTo(self.mesh.position);
                if (distance > self.minimumDistance) {
                    self.mesh.translateZ(self.walkSpeed);
                } else if (distance < self.minimumDistance - 1) {
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
                        self.mesh.traverse(function (object) {
                            object.visible = false;
                        });
                    });
                }
            }
        };
        return Enemy;
    })();
    GP.Enemy = Enemy;
})(GP || (GP = {}));
var GP;
(function (GP) {
    // The Scene Manager
    var SceneManager = (function () {
        // Constructor
        function SceneManager() {
            this.scenes = new Array();
        }
        // The currently active scene
        SceneManager.prototype.getActiveScene = function () {
            if (this.activeIndex === undefined) {
                return undefined;
            }
            return this.scenes[this.activeIndex];
        };

        // Add a scene to the scene list
        SceneManager.prototype.addScene = function (sceneObject) {
            // Only if it's not in there already
            if (this.alreadyExists(sceneObject.name))
                return;

            // Add the scene to the scene list
            this.scenes.push(sceneObject);
        };

        // Go to a specific scene
        SceneManager.prototype.gotoScene = function (sceneName) {
            var self = this;

            this.scenes.some(function (scene, index) {
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
        };

        // Check if a scene is already added to the scene list
        SceneManager.prototype.alreadyExists = function (sceneName) {
            var result = this.scenes.some(function (element) {
                return element.name == sceneName;
            });

            return result;
        };

        // Update the scene manager
        SceneManager.prototype.update = function () {
            var self = this;
            var activeScene = this.getActiveScene();
            if (activeScene != undefined) {
                activeScene.update();
                if (activeScene.sceneFinished) {
                    self.gotoScene(activeScene.next);
                }
            }
        };
        return SceneManager;
    })();
    GP.SceneManager = SceneManager;
})(GP || (GP = {}));
var GP;
(function (GP) {
    // The Content Manager
    var ContentManager = (function () {
        // Constructor
        function ContentManager() {
            // The array containing all the images
            this.imageArray = new Array();
            // The array containing all the models
            this.modelArray = new Array();
            this.loadedCount = 0;
            this.totalResourceCount = 5;
            // Set up the array containing all the images
            this.imageArray[GP.Resources.castlefloor] = 'Content/images/castlefloor.gif';
            this.imageArray[GP.Resources.grass] = 'Content/images/grass.gif';
            this.imageArray[GP.Resources.particle] = 'Content/images/particle.png';
            this.imageArray[GP.Resources.spear] = 'Content/images/spear.gif';

            // Set up the array containing all the models
            this.modelArray[GP.Resources.swordModel] = 'Content/models/sword.js';

            // Load all the images and models
            this.loadImagesToCache();
            this.loadModelsToCache();
        }
        // Check if the loading process is completed
        ContentManager.prototype.isLoadComplete = function () {
            var result = this.loadedCount === this.totalResourceCount;
            return result;
        };

        // Load the images and put them in cache
        ContentManager.prototype.loadImagesToCache = function () {
            var self = this;
            if (!self.imageArray) {
                return;
            }

            for (var key in self.imageArray) {
                var value = self.imageArray[key];
                GP.CACHE.getSet(key, function () {
                    return THREE.ImageUtils.loadTexture(value);
                });
                console.log("Texture '" + key + "' is loaded and saved to cache");
                self.loadedCount++;
            }
        };

        // Load the models and put them in cache
        ContentManager.prototype.loadModelsToCache = function () {
            var self = this;
            if (!self.modelArray) {
                return;
            }

            // Create the JSON loader
            var jsonLoader = new THREE.JSONLoader();

            for (var key in self.modelArray) {
                var source = self.modelArray[key];
                console.log('trying to load ' + key);

                try  {
                    jsonLoader.load(source, function (geometry, materials) {
                        // Step 1: Generate the mesh material
                        var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, useScreenCoordinates: false, transparent: true });

                        // Step 2: Generate the mesh from geometry and material
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.scale.set(0.01, 0.01, 0.01);
                        mesh.position.set(0, -0.4, -2);

                        // Step 3: Add the mesh to the model object
                        var objectContainingMesh = new THREE.Object3D();
                        objectContainingMesh.add(mesh);

                        // Step 4: Add the model object to the cache
                        GP.CACHE.getSet(key, objectContainingMesh);

                        // Step 5: Increment the loaded count
                        console.log("Model '" + key + "' is loaded and saved to cache");
                        self.loadedCount++;
                    });
                } catch (e) {
                    console.log("Model '" + key + "' could not be loaded or put into cache");
                    self.loadedCount++;
                }
            }
        };
        return ContentManager;
    })();
    GP.ContentManager = ContentManager;
})(GP || (GP = {}));
// World of Raul Rule Manager
var GP;
(function (GP) {
    var RuleManager = (function () {
        function RuleManager() {
            // Statics
            this.experienceRate = 0.51;
            this.playerDamage = 1;
        }
        // Calculate the damage done from the player to the enemy
        RuleManager.prototype.calculateDamage = function (player, enemy) {
            var self = this;
            var primaryFired = player.primarySkill.checkFired();
            var playerPos = player.yawObject.position;

            if (primaryFired) {
                // Reduce the energy
                player.viewModel.energy(player.viewModel.energy() - player.primarySkill.energyCost >= 0 ? player.viewModel.energy() - player.primarySkill.energyCost : 0);

                // Check if it's a hit - then decrease enemy health and increase player experience
                if (self.isAliveAndInRange(playerPos, enemy)) {
                    // Decrease enemy health
                    enemy.health -= self.playerDamage;

                    // Increase player experience
                    player.experience += self.playerDamage;
                    self.calculateLevelExperience(player);

                    // Check if enemy has been killed
                    if (enemy.health > 0) {
                        // Damaged the enemy some more ...
                    } else {
                        // You killed the enemy!
                        toastr.success("You killed '" + enemy.name + "'");

                        // TODO: Drop some loot now
                        enemy.dead = true;
                    }
                }
            }
        };

        // Calculate the experience for the player
        RuleManager.prototype.calculateLevelExperience = function (player) {
            var self = this;

            // Calculate the real level
            var calculatedLevel = Math.pow(player.experience, self.experienceRate);

            // Calculate the current and next lvl
            var currentLevel = Math.floor(calculatedLevel);
            var nextLevel = Math.ceil(calculatedLevel);
            var percentageToNextLevel = (calculatedLevel - currentLevel) * 100;
            var roundedPercentage = Math.round(percentageToNextLevel * 100) / 100;

            if (player.viewModel.level() < currentLevel) {
                // Player has leveled up
                self.handleLevelUp(player, currentLevel);
            }

            player.viewModel.experience(roundedPercentage);
        };

        // Handle the player level up logic
        RuleManager.prototype.handleLevelUp = function (player, newLevel) {
            player.viewModel.energy(100);
            player.viewModel.health(100);
            player.viewModel.level(newLevel);
        };

        // Check if the given vector3 is in range or if this enemy is dead
        RuleManager.prototype.isAliveAndInRange = function (playerPosition, enemy) {
            var self = this;

            if (!playerPosition) {
                return enemy.health > 0;
            } else {
                return enemy.health > 0 && Math.abs(playerPosition.x - enemy.mesh.position.x) < 4 && Math.abs(playerPosition.z - enemy.mesh.position.z) < 4;
            }
        };
        return RuleManager;
    })();
    GP.RuleManager = RuleManager;
})(GP || (GP = {}));
var GP;
(function (GP) {
    var WorldManager = (function () {
        // Constructor
        function WorldManager(gameScene) {
            this.gameScene = gameScene;
            var self = this;

            // Setup the rule engine
            self.ruleEngine = new GP.RuleManager();

            // Set the enemy positions
            self.enemies = new Array();
            self.enemyPositions = new Array();
            self.enemyPositions.push(new THREE.Vector2(10, -10), new THREE.Vector2(0, -20), new THREE.Vector2(-10, -10));

            // Create the materials
            var grassTexture = GP.CACHE.get(GP.Resources.grass);
            grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
            grassTexture.repeat.set(10, 10);
            self.basicMaterial = new THREE.MeshBasicMaterial({ map: GP.CACHE.get(GP.Resources.grass), side: THREE.DoubleSide, wireframe: false });
            self.castleMaterial = new THREE.MeshBasicMaterial({ map: GP.CACHE.get(GP.Resources.castlefloor), side: THREE.DoubleSide, wireframe: false });

            // Setup the world
            self.createGround();
            self.createCastle();

            // Spawn the enemies
            self.enemyPositions.forEach(function (value, index) {
                var enemy = new GP.Enemy(value);
                enemy.name = "Enemy" + index;
                self.enemies.push(enemy);
                self.gameScene.scene.add(enemy.mesh);
            });
        }
        // Create the ground mesh
        WorldManager.prototype.createGround = function () {
            var self = this;

            // Create a plane geometry
            var boneLength = 200;
            var segments = boneLength / 5;
            var groundGeometry = new THREE.PlaneGeometry(boneLength, boneLength, segments, segments);
            groundGeometry.name = "groundGeometry";

            // Generate the walls from the ground
            groundGeometry.vertices.forEach(function (vertex, index) {
                if (vertex.x == -100 || vertex.x == 100 || vertex.y == -100 || vertex.y == 100) {
                    vertex.z = -25;
                }
            });

            // Create a mesh
            self.groundMesh = new THREE.Mesh(groundGeometry, self.basicMaterial);
            self.groundMesh.name = "groundMesh";
            self.groundMesh.position.set(0, 0, 0);
            self.groundMesh.rotation.set(Math.PI / 2, 0, 0);

            // Add it to the scene
            self.gameScene.scene.add(self.groundMesh);
        };

        // Create the castle block
        WorldManager.prototype.createCastle = function () {
            var self = this;

            var numberOfBoxes = 1;
            var boneLength = 25;
            var segments = boneLength / 5;

            var baseX = 0;
            var baseY = (boneLength / 2);
            var baseZ = 0;

            var castleObject = new THREE.Object3D();

            for (var index = 0; index < numberOfBoxes; index++) {
                // geometry
                var castleGeometry = new THREE.CubeGeometry(boneLength, boneLength, boneLength, segments, segments, segments);
                castleGeometry.name = "castleGeometry";

                // Create a mesh
                self.castleMesh = new THREE.Mesh(castleGeometry, self.castleMaterial);
                self.castleMesh.name = "castleMesh";
                self.castleMesh.position.set(baseX, baseY + (index * boneLength), baseZ);
                castleObject.add(self.castleMesh);
            }

            castleObject.position.set(0, -0.0001, -27);

            // Add it to the scene
            self.gameScene.scene.add(castleObject);
        };

        // Update the world
        WorldManager.prototype.update = function () {
            var self = this;

            // Update enemies
            self.updateEnemies();
        };

        // Update the enemies
        WorldManager.prototype.updateEnemies = function () {
            var self = this;
            var playerPos = self.gameScene.getPlayerPosition();

            self.enemies.forEach(function (enemy) {
                var lookatPos = new THREE.Vector3(playerPos.x, enemy.mesh.position.y, playerPos.z);
                enemy.update(lookatPos);

                // Let the rule engine decide what happens to the enemy
                if (enemy.health > 0) {
                    self.ruleEngine.calculateDamage(self.gameScene.getPlayer(), enemy);
                }
            });
        };
        return WorldManager;
    })();
    GP.WorldManager = WorldManager;
})(GP || (GP = {}));
var GP;
(function (GP) {
    // Intro class
    var GameScene = (function (_super) {
        __extends(GameScene, _super);
        // Constructor
        function GameScene() {
            _super.call(this, GP.Resources.worldofraul_game, "");
            this.started = false;
            var self = this;

            // Create the scene object
            self.scene = new THREE.Scene();

            // Set the scene color
            self.clearColor = new THREE.Color("#6495ED");

            // Setup the world
            self.worldManager = new GP.WorldManager(self);

            // Camera
            var viewAngle = 55, aspect = window.innerWidth / window.innerHeight, near = 0.1, far = 1000;
            self.camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
            self.camera.name = "camera";

            // Player
            self.player = new GP.Player(self.camera);
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
        GameScene.prototype.initHud = function () {
            var self = this;

            // Initialize knockout
            ko.applyBindings(self.player.viewModel);
        };

        GameScene.prototype.getPlayer = function () {
            return this.player;
        };

        GameScene.prototype.getPlayerPosition = function () {
            return this.player.yawObject.position;
        };

        // Update the scene
        GameScene.prototype.update = function () {
            _super.prototype.update.call(this);
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
        };

        // Suspend this scene
        GameScene.prototype.suspend = function () {
            _super.prototype.suspend.call(this);
            var self = this;

            this.started = false;
            this.sceneFinished = false;
        };
        return GameScene;
    })(GP.Scene);
    GP.GameScene = GameScene;
})(GP || (GP = {}));
/// <reference path="../Scripts/Libraries/jquery.d.ts" />
/// <reference path="../Scripts/Libraries/bootstrap.d.ts" />
/// <reference path="../Scripts/Libraries/knockout.d.ts" />
/// <reference path="../Scripts/Libraries/toastr.d.ts" />
/// <reference path="../Scripts/Libraries/three.d.ts" />
/// <reference path="../Scripts/Libraries/tween.js.d.ts" />
/// <reference path="../Scripts/Libraries/xt.browsers.d.ts" />
/// <reference path="../Scripts/Libraries/xt.microcache.d.ts" />
/// <reference path="../Scripts/Libraries/xt.webgldetector.d.ts" />
/// <reference path="../Scripts/Libraries/xt.windowresize.d.ts" />
/// <reference path="./Game/Resources.ts" />
/// <reference path="./Game/Animation.ts" />
/// <reference path="./Interface/Scene.ts" />
/// <reference path="./Skills/Skill.ts" />
/// <reference path="./Skills/Death.ts" />
/// <reference path="./Skills/Slash.ts" />
/// <reference path="./Game/Player.ts" />
/// <reference path="./Game/Enemy.ts" />
/// <reference path="./Managers/SceneManager.ts" />
/// <reference path="./Managers/ContentManager.ts" />
/// <reference path="./Managers/RuleManager.ts" />
/// <reference path="./Managers/WorldManager.ts" />
/// <reference path="./Interface/GameScene.ts" />
// ..
// ..  Nieuwe naam voor de game: The Dark Days of ...
// ..
// Geuze Portal Entry point
var GP;
(function (GP) {
    // The cache
    GP.CACHE = new MicroCache();

    // Get a random chance and call the win or fail methods
    function Random(chance, win, fail) {
        // Check the required 'chance' and 'win' arguments
        var canContinue = chance && win ? true : false;
        if (canContinue) {
            var rnd = Math.random();
            if (rnd <= chance) {
                win();
            } else {
                if (fail) {
                    fail();
                }
            }
        }
    }
    GP.Random = Random;

    // The Main Game class
    var Main = (function () {
        // Constructor
        function Main() {
            // Stop initializing if the browser is not compatible with WebGL
            if (!this.browserCompatible()) {
                console.log(GP.Resources.browserIncompatible);
                return;
            }

            // Setup the game content
            this.contentManager = new GP.ContentManager();
        }
        // Initialize the rest of the application
        Main.prototype.initApplication = function () {
            // Initialize the variables
            this.container = document.body;

            // Initialize the scene manager and set the startup scene
            this.sceneManager = new GP.SceneManager();
            this.sceneManager.addScene(new GP.GameScene());
            this.sceneManager.gotoScene(GP.Resources.worldofraul_game);

            // Initialize the render engine
            var viewAngle = 75, near = 0.1, far = 100;
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(new THREE.Color("#000000"), 1);

            // Append all controls to the DOM
            this.container.appendChild(this.renderer.domElement);

            // Set the window resize handler
            this.setWindowResizer();

            // Set loading complete
            this.loadingComplete = true;
        };

        // Check if the browser is compatible (Chrome/FF)
        Main.prototype.browserCompatible = function () {
            if (!Detector.webgl) {
                Detector.addGetWebGLMessage();
            }

            return Detector.webgl;
        };

        // Check if loading is complete
        Main.prototype.isLoadingComplete = function () {
            return this.contentManager.isLoadComplete();
        };

        // Set the window resize handler
        Main.prototype.setWindowResizer = function () {
            if (this.resizer) {
                this.resizer.stop();
            }

            var activeScene = this.sceneManager.getActiveScene();
            this.resizer = new THREEx.WindowResize(this.renderer, activeScene.camera);
        };

        // Update the game
        Main.prototype.update = function () {
            var self = this;

            // Don't update anything if the content is still being loaded
            if (!self.contentManager.isLoadComplete()) {
                return;
            }

            this.sceneManager.update();
            this.setWindowResizer();
        };

        // Render the game
        Main.prototype.render = function () {
            var self = this;

            // Don't draw anything if the content is still being loaded
            if (!self.contentManager.isLoadComplete()) {
                return;
            }

            // Render the active scene
            var activeScene = self.sceneManager.getActiveScene();
            if (activeScene && activeScene.scene && activeScene.camera) {
                // Adjust the clear color for this scene
                this.renderer.setClearColor(activeScene.clearColor, 1);

                // Render the scene
                self.renderer.render(activeScene.scene, activeScene.camera);
            }
        };
        return Main;
    })();
    GP.Main = Main;
})(GP || (GP = {}));

// Create new entry instance
var appInstance = new GP.Main();

var appLoop = function () {
    requestAnimationFrame(appLoop);

    // Check if loading is finished
    if (!appInstance.loadingComplete) {
        if (appInstance.isLoadingComplete()) {
            appInstance.initApplication();
        } else {
            // Loading is not complete.. wait some more ...
        }
    } else {
        appInstance.update();
        appInstance.render();
    }
};

$(document).ready(function () {
    appLoop();
});
//# sourceMappingURL=App.js.map
