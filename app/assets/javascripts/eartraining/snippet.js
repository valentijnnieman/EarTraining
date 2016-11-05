  // Snippets are objects holding a single 'piece of music',
// like an interval or a chord progression.

var Vex = require('vexflow');
var Synth = require('./synth.js');

var Snippet = function(notes, element, count) {
  this.notes = notes;
  this.count = count;
  this.test = 'test!';
  this.element = element; // TO-DO: Delete after HTML member has been made
  this.synth = new Synth(this.notes.instrument); 

  this.canvas = document.createElement('canvas')
  this.canvas.width = 180
  this.canvas.height = 64
  this.renderer = new Vex.Flow.Renderer(this.canvas,
    Vex.Flow.Renderer.Backends.CANVAS);
  this.vexCtx = this.renderer.getContext();

  this.html_elements = ` 
    <div class='small-4 columns'>
      <div class='snippet'>
        <div class='row'>
          <div class='small-12 columns'>
            <div class='snippet__title'>
              Listen to the interval and answer below
            </div>
          </div>
        </div>
        <div class='row'>
          <div class='small-12 columns'>
            <div class='snippet__container'>
              <div class='snippet__canvas' id='canvas-${this.count}'></div>

              <div class='snippet__canvas' id='canvas-${this.count}'></div>
            </div>
          </div>
          <button class='button small radius' id='play-${this.count}'>play</button>
        </div>
        <div class='row'>
          <div class='small-12 columns'>
            <div class='answer_input'>
              <ul class='answer_input__menu'>
                <li> 1st </li>
                <li> 2nd </li>
                <li> 3th </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

}

Snippet.prototype.render = function(){
  console.log('render ' + this.test);
  var c = document.createElement("div");
  this.element.insertAdjacentHTML('beforeend', this.html_elements);
  var b = document.getElementById('play-' + this.count);
  var that = this
  b.addEventListener('click', function() {
    that.play()  
  })
  var c = document.getElementById('canvas-' + this.count);
  c.appendChild(this.canvas);

  var stave = new Vex.Flow.Stave(0, -8, 200);
  stave.addClef("treble").addKeySignature(this.notes.key).setContext(this.vexCtx).draw();

  var voice = new Vex.Flow.Voice({
    num_beats: 2,
    beat_value: 4,
    resolution: Vex.Flow.RESOLUTION
  });

  var notesToDraw = []

  for (var i = 0; i < this.notes.all_notes.length; i++){
    note = new Vex.Flow.StaveNote({ clef: "treble", auto_stem: true, keys: [this.notes.all_notes[i].key], duration: this.notes.all_notes[i].duration }),
    notesToDraw.push(note)
  }

  voice.addTickables(notesToDraw);
  formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 200);
  voice.draw(this.vexCtx, stave);
}

Snippet.prototype.play = function(){
  // play the notes 
  console.log('playing')
  console.log(this)
  if (this.notes.type == 'interval') {
    var that = this
    this.synth.playNote(this.notes.all_notes[0].key, 0.01, 0.2, 1.0, 0.8); 
    window.setTimeout(function() {
      that.synth.playNote(that.notes.all_notes[1].key, 0.01, 0.2, 1.0, 0.8); 
    }, this.notes.speed);
  } 
}

Snippet.prototype.solve = function(){
  // handle right and wrong answers
} 

module.exports = Snippet; 