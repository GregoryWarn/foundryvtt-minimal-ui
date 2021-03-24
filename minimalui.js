function collapse(toggleId) {
  let target = document.getElementById(toggleId);
  if (target) {
    target.click();
  }
}

var hotbarLocked = false;
var controlsLocked = false;
var controlsLastPos = '0px';
function lockControls(unlock) {
  let rootStyle = document.querySelector(':root').style;
  if (!controlsLocked) {
    controlsLocked = true;
    controlsLastPos = rootStyle.getPropertyValue('--leftbarstart');
    rootStyle.setProperty('--leftbarstart', '0px');
    if (game.settings.get('minimal-ui', 'sidePanelSize') == 'small') {
      rootStyle.setProperty('--leftbarpad', '10px');
      rootStyle.setProperty('--leftbarstartsub', '50px');
    } else {
      rootStyle.setProperty('--leftbarstartsub', '60px');
    }
    $("#sidebar-lock > i").removeClass("fa-lock-open");
    $("#sidebar-lock > i").addClass("fa-lock");
  } else if (unlock) {
    controlsLocked = false;
    $("#sidebar-lock > i").removeClass("fa-lock");
    $("#sidebar-lock > i").addClass("fa-lock-open");
    rootStyle.setProperty('--leftbarstart', controlsLastPos);
    rootStyle.setProperty('--leftbarstartsub', '-50px');
    if (game.settings.get('minimal-ui', 'sidePanelSize') == 'small') {
      rootStyle.setProperty('--leftbarpad', '20px');
    }

    controlsLastPos = controlsLastPos;
  }
}
function lockHotbar(unlock) {
  let rootStyle = document.querySelector(':root').style;
  if (hotbarLocked && unlock) {
    rootStyle.setProperty('--hotbaranim1', '-45px');
    $("#bar-lock > i").removeClass("fa-lock");
    $("#bar-lock > i").addClass("fa-lock-open");
    hotbarLocked = false;
  } else {
    rootStyle.setProperty('--hotbaranim1', '0px');
    $("#bar-lock > i").removeClass("fa-lock-open");
    $("#bar-lock > i").addClass("fa-lock");
    hotbarLocked = true;
  }
}

Hooks.on('init', () => {
  game.settings.register('minimal-ui', 'sceneNavigation', {
    name: "Scene Navigation",
    hint: "Customize scene navigation UI. Consider 'DF Scene Enhancement' module when this option is set to hidden",
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "shown": "Show Normally",
      "collapsed": "Start Collapsed by Default",
      "hidden": "Hide Completely"
    },
    default: "collapsed",
    onChange: value => {
      window.location.reload()
    }
  });

  game.settings.register('minimal-ui', 'macroBar', {
    name: "Macro Bar",
    hint: "Customize Macro Bar UI",
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "shown": "Show Normally",
      "autohide": "Auto-Hide",
      "collapsed": "Start Collapsed by Default",
      "hidden": "Hide Completely"
    },
    default: "autohide",
    onChange: value => {
      window.location.reload()
    }
  });

  game.settings.register('minimal-ui', 'macroBarPosition', {
    name: "Macro Bar Position",
    hint: "Reference at 350. Minimum is 170. Increase value to move it to right. Reduce to the left.",
    scope: 'world',
    config: true,
    type: Number,
    default: 350,
    onChange: value => {
      window.location.reload()
    }
  });

  game.settings.register('minimal-ui', 'playerList', {
    name: "Player List",
    hint: "Customize Player List UI",
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "default": "Always Visible",
      "autohide": "Auto-Hide",
      "hidden": "Hide Completely"
    },
    default: "autohide",
    onChange: value => {
      window.location.reload()
    }
  });

  game.settings.register('minimal-ui', 'sidePanel', {
    name: "Left panel behavior",
    hint: "Choose whether left panel is always visible or auto hides",
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "always": "Always Visible",
      "autohide": "Auto-Hide"
    },
    default: "autohide",
    onChange: value => {
      window.location.reload()
    }
  });

  game.settings.register('minimal-ui', 'sidePanelSize', {
    name: "Left panel size",
    hint: "Choose favorite side panel size.",
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "small": "Small",
      "standard": "Standard"
    },
    default: "small",
    onChange: value => {
      window.location.reload()
    }
  });

  game.settings.register('minimal-ui', 'sidePanelPosition', {
    name: "Left panel button position",
    hint: "Choose favorite side panel position. Will be ignored if using 'Keep a single column' style.",
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "top": "Top Left",
      "center": "Center Upper Left",
      "lower": "Center Lower Left",
      "bottom": "Bottom Left"
    },
    default: "center",
    onChange: value => {
      window.location.reload()
    }
  });

  game.settings.register('minimal-ui', 'sidePanelMenuStyle', {
    name: "Left panel menu style",
    hint: "Choose whether to expand to the right or keep a single column of buttons",
    scope: 'world',
    config: true,
    type: String,
    choices: {
      "default": "Controls to the right",
      "column": "Keep a single column"
    },
    default: "default",
    onChange: value => {
      window.location.reload()
    }
  });
  
  game.settings.register("minimal-ui", "borderColor", {
    name: "Border Colors",
    hint: "Customize border colors of Foundry. Get color codes from www.w3schools.com/colors/colors_picker.asp",
    scope: "world",
    config: true,
    default: "#ff4900bd",
    type: String,
    onChange: lang => {
      window.location.reload()
    }
  });
  
  game.settings.register("minimal-ui", "shadowColor", {
    name: "Border Colors",
    hint: "Customize shadow colors of Foundry. Get color codes from www.w3schools.com/colors/colors_picker.asp",
    scope: "world",
    config: true,
    default: "#ff4900bd",
    type: String,
    onChange: lang => {
      window.location.reload()
    }
  });

});

Hooks.on('ready', async function() {

  let rootStyle = document.querySelector(':root').style;

  switch(game.settings.get('minimal-ui', 'sceneNavigation')) {
    case 'collapsed': {
      rootStyle.setProperty('--visinav', 'visible');
      collapse("nav-toggle");
      break;
    }
    case 'shown': {
      rootStyle.setProperty('--visinav', 'visible');
      break;
    }
  }

  switch(game.settings.get('minimal-ui', 'macroBar')) {
    case 'collapsed': {
      rootStyle.setProperty('--visihotbar', 'visible');
      collapse("bar-toggle");
      break;
    }
    case 'autohide': {
      rootStyle.setProperty('--visihotbar', 'visible');
      rootStyle.setProperty('--hotbaranim1', '-45px');
      rootStyle.setProperty('--macrobarlh', '12px');
      $("#hotbar-directory-controls").append(
        `
        <a id="bar-lock">
          <i class="fas fa-lock-open"></i>
        </a>
        `
      );
      $("#macro-directory").click(function() {lockHotbar(false)});
      $("#bar-lock").click(function() {lockHotbar(true)});
      break;
    }
    case 'shown': {
      rootStyle.setProperty('--visihotbar', 'visible');
      break;
    }
  }

  let mbPos = game.settings.get('minimal-ui', 'macroBarPosition');
  if (mbPos < 170) {
    rootStyle.setProperty('--macrobarpos', '170px');
  } else {
    rootStyle.setProperty('--macrobarpos', String(mbPos)+'px');
  }

  switch(game.settings.get('minimal-ui', 'playerList')) {
    case 'default': {
      rootStyle.setProperty('--playerfsize', '12px');
      rootStyle.setProperty('--playerwidth', '150px');
      rootStyle.setProperty('--visiplay', 'visible');
      break;
    }
    case 'autohide': {
      rootStyle.setProperty('--visiplay', 'visible');
      break;
    }
  }

  $("#players")[0].val = "";

});

Hooks.once('renderSceneControls', async function() {
  
  let rootStyle = document.querySelector(':root').style;
  
  rootStyle.setProperty('--bordercolor', game.settings.get('minimal-ui', 'borderColor'));
  rootStyle.setProperty('--shadowcolor', game.settings.get('minimal-ui', 'shadowColor'));

  if (game.settings.get('minimal-ui', 'sidePanelSize') == 'small') {
    rootStyle.setProperty('--leftbarstartsub', '50px');
    rootStyle.setProperty('--submenuhover', '50px');
    if (game.settings.get('minimal-ui', 'sidePanel') == 'autohide') {
      rootStyle.setProperty('--leftbarpad', '20px');
    }
  } else {
    rootStyle.setProperty('--leftbarstartsub', '60px');
    rootStyle.setProperty('--submenuhover', '60px');
  }

  switch(game.settings.get('minimal-ui', 'sidePanel')) {
    case 'autohide': {
      if (!controlsLocked) {
        rootStyle.setProperty('--leftbarstart', '-50px');
        rootStyle.setProperty('--leftbarstartsub', '-50px');
      } else {
        rootStyle.setProperty('--leftbarpad', '10px');
      }
      break;
    }
  }

  switch(true) {
    case (game.settings.get('minimal-ui', 'sidePanelPosition') == 'top' || game.settings.get('minimal-ui', 'sidePanelMenuStyle') == 'column'): {
      rootStyle.setProperty('--leftbarpos', '5vmin');
      if (game.settings.get('minimal-ui', 'sidePanelSize') == 'small') {
        if (game.settings.get('minimal-ui', 'sidePanelMenuStyle') == 'column') {
          rootStyle.setProperty('--navistart', '55px');
        } else {
          rootStyle.setProperty('--navistart', '85px');
        }
      } else {
        if (game.settings.get('minimal-ui', 'sidePanelMenuStyle') == 'column') {
          rootStyle.setProperty('--navistart', '65px');
        } else {
          rootStyle.setProperty('--navistart', '110px');
        }
      }
      break;
    }
    case (game.settings.get('minimal-ui', 'sidePanelPosition') == 'center'): {
      rootStyle.setProperty('--leftbarpos', '20vmin');
      rootStyle.setProperty('--navistart', '10px');
      break;
    }
    case (game.settings.get('minimal-ui', 'sidePanelPosition') ==  'lower'): {
      rootStyle.setProperty('--leftbarpos', '30vmin');
      rootStyle.setProperty('--navistart', '10px');
      break;
    }
    case (game.settings.get('minimal-ui', 'sidePanelPosition') ==  'bottom'): {
      rootStyle.setProperty('--leftbarpos', '40vmin');
      rootStyle.setProperty('--navistart', '10px');
      break;
    }
  }

  switch(game.settings.get('minimal-ui', 'sidePanelMenuStyle')) {
    case 'default': {
      rootStyle.setProperty('--submenustyle', 'block');
      break;
    }
    case 'column': {
      rootStyle.setProperty('--submenustyle', 'contents');
      break;
    }
  }
})

Hooks.on('renderSceneControls', async function() {

  $("#controls > li.scene-control").on('click', function() {
    lockControls(false)
    $("#controls > li.scene-control.active > ol > li").on('click', function() {lockControls(false)});
  });
  $("#controls > li.scene-control.active > ol > li").on('click', function() {
    lockControls(false)
  });
  
  switch(game.settings.get('minimal-ui', 'sidePanelSize')) {
    case 'small': {
      $("#controls .scene-control, #controls .control-tool").addClass('small-left-panel');
    }
  }
  
  // --------------- COMPATIBILITY SECTION ------------------
  // Here we add (ugly) hacks for minimal UI to work well with modules that affect UI components
  
  // Give a little time for other modules to add their controls first, and reapply changes
  await new Promise(waitABit => setTimeout(waitABit, 1));

  // Catch all -re apply- for modules that add buttons to controls. Done twice to minimize "Shaking" UI
  switch(game.settings.get('minimal-ui', 'sidePanelSize')) {
    case 'small': {
      $("#controls .scene-control, #controls .control-tool").addClass('small-left-panel');
    }
  }
  
  let locked = controlsLocked ? 'fa-lock' : 'fa-lock-open';
  if (game.settings.get('minimal-ui', 'sidePanel') == 'autohide') {
    $("#controls").append(
      `
      <li id="sidebar-lock" class="scene-control" title="Pin Sidebar" onclick="lockControls(true)">
      <i class="fas ${locked}" style="color: red"></i>
      </li>
      `
    );
    if (game.settings.get('minimal-ui', 'sidePanelSize') == 'small') {
      $("#controls > #sidebar-lock").addClass("small-left-panel");
    }
  }
  
  // Support for Simple Dice Roller
  if (game.modules.has("simple-dice-roller")) {
    $("#controls > li.scene-control.sdr-scene-control").click(function() {
      $("#controls > li.scene-control.sdr-scene-control.active > ol")[0].style.setProperty('display', 'inherit');
    });
  }
  
  // ----------------------------------------------------------------------

})