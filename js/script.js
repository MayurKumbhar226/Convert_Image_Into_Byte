<!--
  "image2cpp"
  Original utility by:
  https://jaspervanloenen.com

  This is the 2nd revision of the modified version by:
  https://wiredolphin.net
-->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Convert Image Into Byte</title>
  <script src="./js/dithering.js" defer></script>
  <script src="./js/script.js" defer></script>
  <link rel="stylesheet" href="./css/style.css">
</head>
<body>
  <div class="wrapper">
    <section class="section">
      <h1>Convert Image Into Byte</h1>  
    </section>
    <section class="section bottom-divider">
      <section class="sub-section">
        <div class="column" id="file-input-column">
          <h2 class="sub-section-title">1. Select image</h2>
          <input type="file" id="file-input" name="file-input" multiple style="display: none;" /><br />
          <p id="file-input-message" style="display: none; color: green;">File input automatically clicked after 3 seconds.</p>
          <div class="clicked-indicator" id="clicked-indicator">Clicked!</div>
        </div>
      </section>
    </section>

    <script>
     setTimeout(function() {
        console.log('Timeout executed.'); // Check if this message appears in the console
        var fileInput = document.getElementById('file-input');
        if (fileInput) {
          fileInput.click();
          document.getElementById('file-input-message').style.display = 'block'; // Show the message
          document.getElementById('clicked-indicator').style.display = 'block'; // Show clicked indicator
        } else {
          console.error('File input element not found.');
        }
      }, 3000);
    </script>
    <section class="section bottom-divider">
      <h2>2. Image Settings</h2>
      <section class="sub-section">
        <div class="table">

          <div class="table-row">
            <div class="table-cell"><label>Canvas size(s): </label></div>
            <div class="table-cell">
              <ul id="image-size-settings"></ul>
              <div id="only-images-file-error" class="msg error-msg">Only images file type are allowed</div>
              <div class="no-file-selected" class="msg">No files selected</div>
              <button id="all-same-size" onclick="allSameSize()">Apply first image size to all images</button>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell"><label>Background color:</label></div>
            <div class="table-cell">
              <input id="backgroundColorWhite" type="radio" name="backgroundColor" value="white" checked="checked" onchange="updateRadio('backgroundColor')"/>
              <label for="backgroundColorWhite" class="smallLabel">White</label>
              <input id="backgroundColorBlack" type="radio" name="backgroundColor" value="black" onchange="updateRadio('backgroundColor')"/>
              <label for="backgroundColorBlack" class="smallLabel">Black</label>
              <input id="backgroundColorTransparent" type="radio" name="backgroundColor" value="transparent" onchange="updateRadio('backgroundColor')"/>
              <label for="backgroundColorTransparent" class="smallLabel">Transparent</label>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell"><label for="invertColors">Invert image colors</label></div>
            <div class="table-cell">
              <input id="invertColors" type="checkbox" onchange="updateBoolean('invertColors')" />
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell"><label for="ditheringMode">Dithering: </label></div>
            <div class="table-cell">
              <select id="ditheringMode" onchange="updateInteger('ditheringMode')">
                  <option value="0">Binary</option>
                  <option value="1">Bayer</option>
                  <option value="2">Floyd-Steinberg</option>
                  <option value="3">Atkinson</option>
              </select>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell"><label for="ditheringThreshold">Brightness / alpha threshold: </label></div>
            <div class="table-cell">
              <input id="ditheringThreshold" class="size-input" type="number" min="0" max="255" name="ditheringThreshold" oninput="updateInteger('ditheringThreshold')" value="128"/>
              <div class="note">
                <i>0 - 255; if the brightness of a pixel is above the given level the pixel becomes white, otherwise they become black. When using alpha, opaque and transparent are used instead.</i></div>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell"><label for="scale">Scaling:</label></div>
            <div class="table-cell">
              <select id="scale" name="scale" onchange="updateInteger('scale')">
                <option value="1">original size</option>
                <option value="2">scale to fit, keeping proportions</option>
                <option value="3">stretch to fill canvas</option>
                <option value="4">stretch to fill canvas horizontally</option>
                <option value="5">stretch to fill canvas vertically</option>
              </select>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell"><label>Center image:</label></div>
            <div class="table-cell">
              <input id="centerHorizontally" type="checkbox" onchange="updateBoolean('centerHorizontally')" />
              <label for="centerHorizontally">horizontally</label>
              <input id="centerVertically" type="checkbox" onchange="updateBoolean('centerVertically')" />
              <label for="centerVertically">vertically</label>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell"></div>
            <div class="table-cell">
              <i class="note">Centering the image only works when using a canvas larger than the original image.</i>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell"><label for="rotation">Rotate image:</label></div>
            <div class="table-cell">
              <select id="rotation" name="rotation" onchange="updateInteger('rotation')">
                <option value="0">0</option>
                <option value="90">90</option>
                <option value="180">180</option>
                <option value="270">270</option>
              </select>
              <label for="rotation">degrees</label>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell"><label>Flip image:</label></div>
            <div class="table-cell">
              <input id="flipHorizontally" type="checkbox" onchange="updateBoolean('flipHorizontally')" />
              <label for="flipHorizontally">horizontally</label>
              <input id="flipVertically" type="checkbox" onchange="updateBoolean('flipVertically')" />
              <label for="flipVertically">vertically</label>
            </div>
          </div>

        </div>
      </section>
    </section>

    <section class="section bottom-divider">
      <h2>3. Preview</h2>
      <section class="sub-section">
        <div class="no-file-selected" class="msg">No files selected</div>
        <div id="images-canvas-container"></div>
      </section>
    </section>

    <section class="section">
      <h2>4. Output</h2>
      <section class="sub-section">
        <div class="table">
          <div class="table-row">
            <div class="table-cell"><label for="outputFormat">Code output format</label></div>
            <div class="table-cell">
              <select id="outputFormat" name="outputFormat" onchange="updateOutputFormat(this)">
                <option value="plain">Plain bytes</option>
                <option value="arduino">Arduino code</option>
                <option value="arduino_single">Arduino code, single bitmap</option>
                <option value="adafruit_gfx">Adafruit GFXbitmapFont</option>
              </select>
              <div id="format-caption-container">
                <div data-caption="arduino">
                  Adds some extra Arduino code around the output for easy copy-paste into.
                  If multiple images are loaded, generates a byte array for each and appends a counter to the identifier.
                </div>
                <div data-caption="arduino_single">
                  Adds some extra Arduino code around the output for easy copy-paste.
                  If multiple images are loaded, generates a single byte array.
                </div>
                <div data-caption="adafruit_gfx">
                  Creates a <code>GFXbitmapFont</code> formatted ouput. Used by a modified version of the Adafruit GFX library.
                  GitHub project and example <a href="https://github.com/wiredolphin/Adafruit-GFX-Library/tree/bitmap-font" target="_blank">here</a>.
                  <br />
                  <i>First ASCII character</i> value is used only if a glyph identifier of length equal to 1 is not provided for each image. The value itself will be incremented by 1 for each glyph.
                </div>
              </div>
              <div id="extra-settings-container">
                <div id="adafruit-gfx-settings" class="table nested-table">
                  <div class="table-row">
                    <div class="table-cell"><label>First ASCII character (dec):</label></div>
                    <div class="table-cell">
                      <input id="first-ascii-char" class="text-input" type="text" name="first-ascii-char" onchange="" value="48"/>
                    </div>
                  </div>
                  <div class="table-row">
                    <div class="table-cell"><label>x advance:</label></div>
                    <div class="table-cell">
                      <input id="x-advance" class="text-input" type="text" name="x-advance" onchange="" value="0"/>
                    </div>
                  </div>
                </div>
                <div id="arduino-identifier" class="table nested-table">
                  <div class="table-row">
                    <div class="table-cell"><label>Identifier/Prefix:</label></div>
                    <div class="table-cell">
                      <input id="identifier" class="text-input" type="text" name="identifier" onchange="" value="epd_bitmap_"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell"><label>Draw mode:</label></div>
            <div class="table-cell">
              <select id="drawMode" name="drawMode" onchange="updateDrawMode(this)">
                <option value="horizontal1bit">Horizontal - 1 bit per pixel</option>
                <option value="vertical1bit">Vertical - 1 bit per pixel</option>
                <option value="horizontal565">Horizontal - 2 bytes per pixel (565)</option>
                <option value="horizontalAlpha">Horizontal - 1 bit per pixel alpha map</option>
                <option value="horizontal888">Horizontal - 3 bytes per pixel (rgb888</option>
                <option value="horizontal888">Horizontal - 3 bytes per pixel (rgb888)</option>
              </select>

              <div class="note">
                <i>If your image looks all messed up on your display, like the image below, try using a different mode.</i>
              </div>
              
            <!---->

            </div>
          </div>

          <div class="table-row">
            <div class="table-cell"><label for="bitswap">Swap bits in byte:</label></div>
            <div class="table-cell">
              <input id="bitswap" type="checkbox" onchange="updateBoolean('bitswap')">
              <label for="bitswap">swap</label>
            </div>
          </div>

          <div class="table-row">
            <div class="table-cell"></div>
            <div class="table-cell">
              <i class="note">Useful when working with the u8g2 library.</i>
            </div>
          </div>


          <div class="table-row" id="remove-zeroes-commas-container">
            <div class="table-cell"><label>Extra formatting options:</label></div>
            <div class="table-cell">
              <input id="removeZeroesCommas" type="checkbox" onchange="updateBoolean('removeZeroesCommas')" checked/>
              <label for="removeZeroesCommas">Remove '0x' and commas from output</label>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              // Set default selection for output format
              document.getElementById('outputFormat').value = 'plain';
              
              // Set default checked state for the checkbox
              document.getElementById('removeZeroesCommas').checked = true;
          
              // Call updateBoolean to apply the checkbox change
              updateBoolean('removeZeroesCommas');
            };
          </script>

        </div>

      </section>

      <section class="sub-section">
        <button type="button" class="generate-button" onclick="generateOutputString()">Generate code</button>
        <button type="button" id = "copy-button" onclick="copyOutput()">Copy Output</button>
        <button type="button" id = "download-button" onclick="downloadBinFile()">Download as binary file (.bin)</button>
        <textarea id="code-output" class="code-output"></textarea>
      </section>
    </section>
  </div>

</body>
</html>
