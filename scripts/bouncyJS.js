// TODO: any position that is hard coded needs to be changed. That's a problem, and makes this not very compatible.
// TODO: Make this game complient with the standards Heidi linked to in her email.
let config = {
    type: Phaser.AUTO,
    parent: "game-area",
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
    // Load all image pngs as their alias
    this.load.image('leg_ballet', 'assets/bouncyLeg_ballet.png');
    this.load.image('leg_flipper', 'assets/bouncyLeg_flipper.png');
    this.load.image('leg_hook', 'assets/bouncyLeg_hook.png');
    this.load.image('leg_shoe', 'assets/bouncyLeg_shoe.png');
    this.load.image('bouncy_legless', 'assets/bouncy_legless_body.png');
    this.load.image("frame_full", "assets/frame_full_missing.png");

    this.load.image("stage", "assets/stage background_sized.jpg");
    this.load.image("beach", "assets/beach background_sized.jpg");
    this.load.image("ship", "assets/pirateship background_sized.jpg");
    this.load.image("grass", "assets/grass background_sized.jpg");

    this.load.image("printButton", "assets/print button.png");

    this.load.audio("pop", "assets/pop.mp3");

}
    // The object that is currently attached to bouncy's leg.
    let snappedObject;
function create() {
    let bouncy = this.add.image(400, 230, "bouncy_legless");
    bouncy.setScale(1.5);
    let frame = this.add.image(400, 570, "frame_full");
    let pop = this.sound.add("pop");

    let background = this.add.image(game.config.width / 2, game.config.height / 2, "beach");
    background.setDepth(-2);

    let printButton = this.add.sprite(670, game.config.height / 2, "printButton").setScale(0.6).setInteractive()
        .on('pointerdown', printCanvas)
        .on('pointerover', () => printButton.setTint(0xadd8e6))
        .on('pointerout', () => printButton.clearTint());


    let shoe = this.add.sprite(400, 400, "leg_shoe");
    let hook = this.add.sprite(400, 400, "leg_hook");
    let flipper = this.add.sprite(400, 400, "leg_flipper");
    let ballet = this.add.sprite(400, 400, "leg_ballet");

    //TODO: Refactor all of this. Why is it chaining some things, looping through some things,
    //  and individually setting some things. Terrible.
    
    //TODO: Do scaling for webpage. Doesn't work for webpages or resizing.
    // Probably have to use some kind of calculation for placing items. Bounding box, divide into 4?
    // Setting the home position and corrosponding background image for each item
    shoe.homePos = {"x": 186, "y": 578};
    shoe.bgImage = "grass";

    hook.homePos = {"x": 315, "y": 582};
    hook.bgImage = "ship";

    ballet.homePos = {"x": 446, "y": 582};
    ballet.bgImage = "stage";

    flipper.homePos = {"x": 643, "y": 581};
    flipper.bgImage = "beach";

    // Creating the actual game objects for each draggable item
    shoe.setPosition(shoe.homePos.x, shoe.homePos.y).setInteractive().setScale(0.6);
    hook.setPosition(hook.homePos.x, hook.homePos.y).setInteractive().setScale(0.6);
    ballet.setPosition(ballet.homePos.x, ballet.homePos.y).setInteractive().setScale(0.6);
    flipper.setPosition(flipper.homePos.x, flipper.homePos.y).setInteractive().setScale(0.6);

    let group = [shoe, hook, flipper, ballet];

    for (let i = 0; i < group.length; i++) {
        this.input.setDraggable(group[i]);
    }

    // Anchor spot for Bouncy's leg
    let legAnchor = {"x": 352.0028409957886, "y": 343.9204559326172};

    //TODO: Possibly make it so that dragging an appendage to anywhere on the top of the screen snaps.
    // JB and I talked about it, and it seems like the action of dragging up at all means you want to attach

    // Threshhold for snapping to legAnchor
    let anchorThreshhold = 80;

    this.input.dragDistanceThreshold = 4;


    this.input.on('dragstart', function (pointer, gameObject) {
        gameObject.setTint(0xadd8e6);
        gameObject.setDepth(1); // Set depth to 1 to bring object to foreground

    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        // Drag gameObject from whever you started drag
        gameObject.x = dragX;
        gameObject.y = dragY;

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
        if (Math.abs(gameObject.x - legAnchor.x) <= anchorThreshhold && Math.abs((gameObject.y - gameObject.displayHeight / 2) - legAnchor.y) <= anchorThreshhold) {
            if (snappedObject != null) { // if there is already an object snapped to bouncy.
                sendHome(snappedObject); // send home currently snapped object.
            }
            snappedObject = gameObject; // set snappedObject as gameObject.
            pop.play(); // Play pop noise.

            gameObject.x = legAnchor.x;
            gameObject.y = legAnchor.y + gameObject.displayHeight / 2;
            background.setTexture(gameObject.bgImage);

        } else { // If not close to letAnchor, snap to home spot
            gameObject.x = gameObject.homePos.x;
            gameObject.y = gameObject.homePos.y;
            if (gameObject === snappedObject) { // if the snapped object is removed, clear snapped object variable.
                snappedObject = null;
            }
        }
        // console.log(pointer.x + ", " + pointer.y)

    });

// TODO: This function DOES NOT WORK. It crashed webpage. Fix!
async function printCanvas() {
    let toHideObjects = [frame, shoe, hook, ballet, flipper, printButton];
    for (let i = 0; i < toHideObjects.length; i++) {
        if (toHideObjects[i] !== snappedObject) {
            toHideObjects[i].visible = false;
        }
    }
    bouncy.y += 100;
    if (snappedObject != null) {
        snappedObject.y += 100;
    }
    await sleep(200);
    print();
    await sleep(200);
    bouncy.y -= 100;
    if (snappedObject != null) {
        snappedObject.y -= 100;
    }
    for (let i = 0; i < toHideObjects.length; i++) {
        toHideObjects[i].visible = true;
    }

    // This print function doesn't work. I don't know why
    // It is supposed to print just the frame, but I don't think I'm passing the element ID correctly.
    // frame.visible = true;
    // let printContent = document.getElementById("game-area");
    // let WinPrint = window.open('', '', 'width=800,height=700');
    // WinPrint.document.write(printContent.innerHTML);
    // WinPrint.document.close();
    // WinPrint.focus();
    // WinPrint.print();
    // WinPrint.close();
}
}

// Remove if unused. Why is it unused?? What does it do?
function update() {

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to send gameObject back to it's home position.
function sendHome(gameObject) {
    gameObject.x = gameObject.homePos.x;
    gameObject.y = gameObject.homePos.y;

}

