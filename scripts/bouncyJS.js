let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 700,
    // transparent: true,
    backgroundColor: "#808080",
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
Phaser.Display.Color = 255;

function preload() {
    this.load.image('leg_ballet', 'assets/bouncyLeg_ballet.png');
    this.load.image('leg_flipper', 'assets/bouncyLeg_flipper.png');
    this.load.image('leg_hook', 'assets/bouncyLeg_hook.png');
    this.load.image('leg_shoe', 'assets/bouncyLeg_shoe.png');
    this.load.image('bouncy_legless', 'assets/bouncy_legless.png');
    this.load.image("frame_full", "assets/frame_full_missing.png");

    // this.load.audio("pop", "assets/pop.mp3");

}

function create() {
    let bouncy = this.add.image(400, 230, "bouncy_legless");
    bouncy.setScale(1.5);
    let frame = this.add.image(400, 570, "frame_full")

    let shoe = this.add.sprite(400, 400, "leg_shoe").setInteractive();
    let hook = this.add.sprite(400, 400, "leg_hook").setInteractive();
    let flipper = this.add.sprite(400, 400, "leg_flipper").setInteractive();
    let ballet = this.add.sprite(400, 400, "leg_ballet").setInteractive();

    shoe.homePos = {"x": 186, "y": 578};
    hook.homePos = {"x": 315, "y": 582};
    ballet.homePos = {"x": 446, "y": 582};
    flipper.homePos = {"x": 643, "y": 581};

    shoe.setPosition(shoe.homePos.x, shoe.homePos.y);
    hook.setPosition(hook.homePos.x, hook.homePos.y);
    ballet.setPosition(ballet.homePos.x, ballet.homePos.y);
    flipper.setPosition(flipper.homePos.x, flipper.homePos.y);

    console.log(game.scene);
    let group = [shoe, hook, flipper, ballet];

    for (let i = 0; i < group.length; i++) {
        this.input.setDraggable(group[i]);
        group[i].setScale(0.6);
    }

    // Anchor spot for Bouncy's leg
    let legAnchor = {"x": 352.0028409957886,"y": 343.9204559326172};
    // Threshhold for snapping to legAnchor
    let anchorThreshhold = 80;

    this.input.dragDistanceThreshold = 4;

    let snappedObject;
    this.input.on('dragstart', function (pointer, gameObject) {
        gameObject.setTint(0xadd8e6);
        gameObject.setDepth(1); // Set depth to 1 to bring object to foreground

    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        // Drag gameObject from whever you started drag
        gameObject.x = dragX;
        gameObject.y = dragY;
        console.log("testing for git!");

        // Snap gameObject center to pointer
        // gameObject.x = pointer.x;
        // gameObject.y = pointer.y;

        // Snap top middle of gameObject to pointer
        // gameObject.x = pointer.x;
        // gameObject.y = pointer.y + (gameObject.displayHeight / 2);

    });

    this.input.on('dragend', function (pointer, gameObject) {

        gameObject.clearTint();
        gameObject.setDepth(0); // Set to default depth.
        // Check if limb is close to legAnchor spot, and if so snap to correct spot.
        if(Math.abs(gameObject.x - legAnchor.x) <= anchorThreshhold && Math.abs((gameObject.y - gameObject.displayHeight/2) - legAnchor.y) <= anchorThreshhold) {
            if (snappedObject != null) { // if there is already an object snapped to bouncy
                sendHome(snappedObject); // send home currently snapped object.
            }
            snappedObject = gameObject; // set snappedObject as gameObject.

            gameObject.x = legAnchor.x;
            gameObject.y = legAnchor.y + gameObject.displayHeight/2;

        } else { // If not close to letAnchor, snap to home spot
            gameObject.x = gameObject.homePos.x;
            gameObject.y = gameObject.homePos.y;
        }
        // console.log(pointer.x + ", " + pointer.y)

    });
}

function update() {

}

function sendHome(gameObject) {
    gameObject.x = gameObject.homePos.x;
    gameObject.y = gameObject.homePos.y;

}
// onmousemove = function(e){console.log("mouse location:", e.clientX, e.clientY)}
