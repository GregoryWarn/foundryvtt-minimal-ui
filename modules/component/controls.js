import {debouncedReload, rootStyle} from '../util.js';
import '../../styles/component/controls.css';

export default class MinimalUIControls {

    static delayedProcessing = false;

    static cssControlsStandardWidth = '36px';
    static cssControlsStandardHeight = '30px';
    static cssControlsStandardLineHeight = '30px';
    static cssControlsStandardFontSize = '24px';

    static cssControlsSmallWidth = '25px';
    static cssControlsSmallHeight = '24px';
    static cssControlsSmallLineHeight = '25px';
    static cssControlsSmallFontSize = '15px';

    static cssControlSubMarginSmall = 0;
    static cssControlSubMarginStandard = 10;

    static positionControls() {
        const logoSettings = game.settings.get('minimal-ui', 'foundryLogoSize');
        const navSettings = game.settings.get('minimal-ui', 'sceneNavigation');
        const navSizeSettings = game.settings.get('minimal-ui', 'sceneNavigationSize');
        if (logoSettings === 'hidden' && navSettings === 'hidden') {
            rootStyle.setProperty('--controlstop', '-65px');
        } else if (navSizeSettings === 'big') {
            rootStyle.setProperty('--controlstop', '115px');
        } else if (navSizeSettings === 'standard') {
            rootStyle.setProperty('--controlstop', '100px');
        } else if (logoSettings !== 'standard') {
            rootStyle.setProperty('--controlstop', '75px');
        }
    }

    static showSubControls() {
        if (game.settings.get('minimal-ui', 'controlsSubHide') === 'autohide') {
            rootStyle.setProperty('--controlssubop', '0%');
        } else if (game.settings.get('minimal-ui', 'controlsSubHide') === 'autohide-plus') {
            rootStyle.setProperty('--controlssubopna', '0%');
        }
    }

    static sizeControls() {
        const logoSettings = game.settings.get('minimal-ui', 'foundryLogoSize');
        if (game.settings.get('minimal-ui', 'controlsSize') === 'small') {
            rootStyle.setProperty('--controlsw', MinimalUIControls.cssControlsSmallWidth);
            rootStyle.setProperty('--controlsh', MinimalUIControls.cssControlsSmallHeight);
            rootStyle.setProperty('--controlslh', MinimalUIControls.cssControlsSmallLineHeight);
            rootStyle.setProperty('--controlsfs', MinimalUIControls.cssControlsSmallFontSize);
            if (logoSettings === 'small')
                rootStyle.setProperty('--controlssubmargin', MinimalUIControls.cssControlSubMarginSmall + 'px');
            else
                rootStyle.setProperty('--controlssubmargin', (MinimalUIControls.cssControlSubMarginSmall - 10) + 'px');
        } else {
            rootStyle.setProperty('--controlsw', MinimalUIControls.cssControlsStandardWidth);
            rootStyle.setProperty('--controlsh', MinimalUIControls.cssControlsStandardHeight);
            rootStyle.setProperty('--controlslh', MinimalUIControls.cssControlsStandardLineHeight);
            rootStyle.setProperty('--controlsfs', MinimalUIControls.cssControlsStandardFontSize);
            rootStyle.setProperty('--controlssubmargin', MinimalUIControls.cssControlSubMarginStandard + 'px');
        }
    }

    static initSettings() {
        game.settings.register('minimal-ui', 'controlsSize', {
            name: game.i18n.localize("MinimalUI.ControlsSizeName"),
            hint: game.i18n.localize("MinimalUI.ControlsSizeHint"),
            scope: 'world',
            config: true,
            type: String,
            choices: {
                "small": game.i18n.localize("MinimalUI.SettingsSmall"),
                "standard": game.i18n.localize("MinimalUI.SettingsStandard")
            },
            default: "small",
            onChange: MinimalUIControls.sizeControls
        });
        game.settings.register('minimal-ui', 'controlsSubHide', {
            name: game.i18n.localize("MinimalUI.ControlsSubHideName"),
            hint: game.i18n.localize("MinimalUI.ControlsSubHideHint"),
            scope: 'world',
            config: true,
            type: String,
            choices: {
                "autohide": game.i18n.localize("MinimalUI.SettingsAutoHide"),
                "autohide-plus": game.i18n.localize("MinimalUI.SettingsAutoHidePlus"),
                "visible": game.i18n.localize("MinimalUI.SettingsAlwaysVisible")
            },
            default: "autohide-plus",
            onChange: debouncedReload
        });
    };
    static initHooks() {
        Hooks.once('renderSceneControls', function () {
            MinimalUIControls.positionControls();
            MinimalUIControls.showSubControls();
            MinimalUIControls.sizeControls();
        });
        Hooks.on('renderSceneControls', function() {
            function controlsSubHoverRefresh() {
                setTimeout(() => {
                    const activeElement = $('#controls');
                    if (activeElement.length && !activeElement.is(':hover')) {
                        rootStyle.setProperty('--controlssubdisna', 'none');
                        MinimalUIControls.delayedProcessing = false;
                    } else controlsSubHoverRefresh();
                }, 6000)
            }
            function controlsSubClickRefresh() {
                setTimeout(() => {
                    if (game.settings.get('minimal-ui', 'controlsSubHide') === 'autohide')
                        rootStyle.setProperty('--controlssubop', '0%');
                    else if (game.settings.get('minimal-ui', 'controlsSubHide') === 'autohide-plus') {
                        controlsSubHoverRefresh();
                    }
                    rootStyle.setProperty('--opacitycontrols', game.settings.get("minimal-ui", "transparencyPercentage") + '%');
                }, 3000)
            }
            if (['autohide', 'autohide-plus'].includes(game.settings.get('minimal-ui', 'controlsSubHide'))) {
                $('#controls li').click(() => {
                    rootStyle.setProperty('--controlssubop', '100%');
                    rootStyle.setProperty('--controlssubopna', '100%');
                    rootStyle.setProperty('--opacitycontrols', '100%');
                    rootStyle.setProperty('--controlssubdisna', 'block');
                    controlsSubClickRefresh();
                });
                if (game.settings.get('minimal-ui', 'controlsSubHide') === 'autohide-plus') {
                    $('#controls li').hover(() => {
                        if (MinimalUIControls.delayedProcessing) return;
                        MinimalUIControls.delayedProcessing = true;
                        rootStyle.setProperty('--controlssubdisna', 'block');
                        controlsSubHoverRefresh();
                    });
                }
            }
        });
    };
}