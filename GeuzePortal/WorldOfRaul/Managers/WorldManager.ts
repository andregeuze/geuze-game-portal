module GP {
    export class WorldManager {

        // Fields
        private basicMaterial: THREE.MeshBasicMaterial;
        private castleMaterial: THREE.MeshBasicMaterial;
        private groundMesh: THREE.Mesh;
        private castleMesh: THREE.Mesh;
        private enemyPositions: Array<THREE.Vector2>;

        // Rules, calculations
        private ruleEngine: RuleManager;

        // Game object collections
        private enemies: Array<Enemy>;

        // Constructor
        constructor(private gameScene: GameScene) {
            var self = this;

            // Setup the rule engine
            self.ruleEngine = new RuleManager();

            // Set the enemy positions
            self.enemies = new Array<Enemy>();
            self.enemyPositions = new Array<THREE.Vector2>();
            self.enemyPositions.push(
                new THREE.Vector2(10, -10),
                new THREE.Vector2(0, -20),
                new THREE.Vector2(-10, -10));

            // Create the materials
            var grassTexture: THREE.Texture = GP.CACHE.get(GP.Resources.grass);
            grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
            grassTexture.repeat.set(10, 10);
            self.basicMaterial = new THREE.MeshBasicMaterial({ map: GP.CACHE.get(GP.Resources.grass), side: THREE.DoubleSide, wireframe: false });
            self.castleMaterial = new THREE.MeshBasicMaterial({ map: GP.CACHE.get(GP.Resources.castlefloor), side: THREE.DoubleSide, wireframe: false });

            // Setup the world
            self.createGround();
            self.createCastle();

            // Spawn the enemies
            self.enemyPositions.forEach((value, index) => {
                var enemy = new Enemy(value);
                enemy.name = "Enemy" + index;
                self.enemies.push(enemy);
                self.gameScene.scene.add(enemy.mesh);
            });
        }

        // Create the ground mesh
        private createGround() {
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
        }

        // Create the castle block
        private createCastle() {
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
        }

        // Update the world
        public update() {
            var self = this;

            // Update enemies
            self.updateEnemies();
        }

        // Update the enemies
        private updateEnemies() {
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
        }
    }
}