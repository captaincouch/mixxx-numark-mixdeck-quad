// Define the name of the function prefix
// eslint-disable-next-line no-var
var MixdeckQuad = {};

MixdeckQuad.init = function (id, debugging) {
    MixdeckQuad.id = id; // Store the device ID to be used later
}

// Enable scratching when touching the touch-sensitive jog wheel
MixdeckQuad.wheelTouch = function (channel, control, value, status, group) {
    var deckNumber = script.deckFromGroup(group);
    if ((status & 0xF0) === 0x90) {    // If touching the wheel
        var alpha = 1.0/8;
        var beta = alpha/32;
        engine.scratchEnable(deckNumber, 8000, 33+1/3, alpha, beta);
    } 
    else {    // If releasing touch from the wheel
        engine.scratchDisable(deckNumber);
    }
}

// Perform/control scratching and jogging
MixdeckQuad.wheelTurn = function (channel, control, value, status, group) {

    // Mixdeck Quad jog wheels center on 64, so option B used
    // https://github.com/mixxxdj/mixxx/wiki/Midi-Scripting

    var newValue;
    if (value > 64) {
        newValue = value - 120;
    } else {
        newValue = value - 8;
    }
    
    // Register jog wheel movement
    var deckNumber = script.deckFromGroup(group);
    if (engine.isScratching(deckNumber)) { // If touching the wheel and turning...
        engine.scratchTick(deckNumber, newValue); // Perform scratching
    } else {                                // Otherwise, if not touching the wheel and turning
        engine.setValue(group, 'jog', newValue); // Perform pitch bending
        return;
    }

}

MixdeckQuad.pitchbend = function (channel, control, value, status, group) {

    var jogValue;
    if (value <= 0x7F && value >= 0x59) {
        newValue = value - 120;
    }
    else if (value >= 0) {
        newValue = value - 8;
    }    

    // Register jog wheel movement
    var deckNumber = script.deckFromGroup(group); // Get deck number
        engine.setValue(group, 'jog', newValue); // Perform pitch bending
        return;

}




MixdeckQuad.shutdown = function() {
    // turn off LEDs
    for (var i = 1; i <= 40; i++) {
        midi.sendShortMsg(0x90, i, 0x00);
    }
}